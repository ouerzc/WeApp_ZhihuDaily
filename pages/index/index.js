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
    topStories: [],
    winWidth: 0,
    winHeight: 0
  },
  onLoad: function (option) {
    console.log('onLoad',option);
    if(option.theme){
      this.setData({
        pageType: 1,
        themeId: option.theme
      })
      getThemesList.call(this, option.theme);
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

    wx.getSystemInfo( {
        success: function( res ) {
            that.setData( {
                winWidth: res.windowWidth,
                winHeight: res.windowHeight
            });
        }
    });
  },
  onPullDownRefresh: function() {
    console.log("onPullDownRefresh");
  },
  loadMore: function(){
    console.log("loadMore");
    var currDate = this.data.date;
    var year = currDate.slice(0, 4);
    var month = currDate.slice(4, 6);
    var day = currDate.slice(6);

    var monthCountDay = {
      1:31,
      2:30,
      3:31,
      4:30,
      5:31,
      6:30,
      7:31,
      8:31,
      9:30,
      10:31,
      11:30,
      12:31,
    };

    console.log("year:"+year, "month:"+month,"day:"+day);
    if(day - 1 > 0){
      var beforeDate = year + month + day;
      getBeforeNews.call(this, beforeDate);
    }else{
      var lastMonth = month - 1;
      var beforeDate = year + lastMonth + monthCountDay[lastMonth];
      getBeforeNews.call(this, beforeDate);
    }
  }

});

//获取最新消息
function getLatestNews(){
  var that = this
  requests.getLatestNews({}, ( data ) => {
    console.log("getLatestNews",data);
    that.setData(
      {
        "date": data.date,
        "stories": [{
          date:data.date,
          stories: data.stories,
        }],
        "topStories": data.top_stories
      }
    )
    console.log("getLatestNews_data",that.data);
  }, () =>{
    console.log("request err")
  }, () => {
    console.log("request conplete")
  });
}

//获取过往消息
function getBeforeNews(date){
  var that = this
  requests.getBeforeNews(date, ( data ) => {
    console.log("getBeforeNews",data);
    var newStories = that.data.stories.concat(
      {
        date:data.date,
        stories:data.stories
      }
    );
    that.setData(
      {
        "date": data.date,
        "stories": newStories,
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
function getThemesList(theme_id){
  var that = this
  console.log(that);
  requests.getThemesList( theme_id, ( data ) => {
    console.log("getThemesList",data);
    that.setData(
      {
        "stories": [
          {
            date:data.date,
            stories:data.stories
          }
        ],
      }
    )
  }, () =>{
    console.log("request err")
  }, () => {
    console.log("request conplete")
  });
}