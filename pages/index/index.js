//index.js
var requests = require('../../utils/request.js');
//获取应用实例
var app = getApp()

Page({
  data: {
    pageType:0, //页面类型，用来分别显示普通日报或者为主题日报， 0：普通日报，1：主题日报
    themeId: null,
    date: null,
    stories: [],
    topStories: []
  },
  onLoad: function (option) {
    console.log('onLoad',option);
    if(option.theme){
      this.setData({
        pageType: 1,
        themeId: option.theme
      })
      getThemesList.call(this);
    }else{
      getLatestNews.call(this);
    }
    
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

//获取最新消息
function getLatestNews(){
  var that = this
  requests.getLatestNews({}, ( data ) => {
    console.log(that);
    console.log("getLatestNews",data);
    that.setData(
      {
        "date": data.date,
        "stories": data.stories,
        "topStories": data.top_stories
      }
    )
  }, () =>{
    console.log("request err")
  }, () => {
    console.log("request conplete")
  });
}

//获取主题日报详细列表
function getThemesList(){
  var that = this
  console.log(that);
  requests.getThemesList( that.data.themeId, ( data ) => {
    console.log("getThemesList",data);
    that.setData(
      {
        "stories": data.stories,
      }
    )
  }, () =>{
    console.log("request err")
  }, () => {
    console.log("request conplete")
  });
}