//story.js
var requests = require('../../utils/request.js');
//获取应用实例
var app = getApp()

Page({
  data: {
    id: null,
    story: null,
    body_res: null,
    question_title: null,
    author: null,
    bio: null
  },
  onLoad: function (option) {
    console.log('onLoad option',option);
    this.setData({id: option.id})
    getNewsDetail.call(this);
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
});


function getNewsDetail(){
  var that = this
  requests.getNewsDetail( that.data.id, ( data ) => {
    console.log("getNewsDetail",data);
    that.setData(
      {
        "story": data,
      }
    )
    getDetailInfo(that);
  }, () =>{
    console.log("request err")
  }, () => {
    console.log("request conplete")
  });
}

//处理知乎日报api反回来的html结构
function getDetailInfo(that){
  var body = that.data.story.body
  //截取问题标题
  var question_title = body.match(/<h2 class=\"question-title\">(.*?)<\/h2>/)
  //截取作者信息
  var author = body.match(/<span class=\"author\">(.*?)<\/span>/)
  //截取作者简介
  var bio = body.match(/<span class=\"bio\">(.*?)<\/span>/)
  //截取主体内容
  var body_arr = body.match(/<p>.*?<\/p>/g)
  var body_res = [];

  body_arr.forEach((element, index, array) => {
    //是否为图片链接
    if(/<img.*?>/.test( element )){
      element = element.match( /(http:|https:).*?\.(jpg|jpeg|gif|png)/ );
      body_res.push({
        type: "img",
        value:element[0]
      })
      //是否为粗体
    } else if (/<strong.*?>/.test( element )) {
      element = element.replace( /<p>/g, '' )
                      .replace( /<\/p>/g, '' )
                      .replace( /<strong>/g, '' )
                      .replace( /<\/strong>/g, '' )
                      .replace( /<a.*?\/a>/g, '' )
                      .replace( /&nbsp;/g, ' ' )
                      .replace( /&ldquo;/g, '"' )
                      .replace( /&rdquo;/g, '"' )
      body_res.push({
        type: "strong",
        value:element
      })
      //普通段落
    }else{
      element = element.replace( /<p>/g, '' )
                      .replace( /<\/p>/g, '' )
                      .replace( /<a.*?\/a>/g, '' )
                      .replace( /&nbsp;/g, ' ' )
                      .replace( /&ldquo;/g, '"' )
                      .replace( /&rdquo;/g, '"' )
      body_res.push({
        type: "p",
        value:element
      })
    }
    
  })


  that.setData({
    question_title: question_title[1],
    author: author[1],
    bio: bio[1],
    body_res: body_res
  })
  console.log("body_res", that.data.body_res)
}