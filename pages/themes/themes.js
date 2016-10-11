//themes.js
var requests = require('../../utils/request.js');
//获取应用实例
var app = getApp()

Page({
  data: {
    id: null,
    others: [],
    subscribed: []
  },
  onLoad: function (option) {
    console.log('onLoad option',option);
    // this.setData({id: option.id})
    getThemes.call(this);
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

function getThemes(){
  var that = this
  requests.getThemes( {}, ( data ) => {
    that.setData(
      {
        "others": data.others,
        "subscribed": data.subscribed
      }
    )
    console.log("getThemes",data);
    // getDetailInfo(that);
  }, () =>{
    console.log("request err")
  }, () => {
    console.log("request conplete")
  });
}