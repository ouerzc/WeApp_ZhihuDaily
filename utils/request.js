var utils = require('./util.js');

var api = {
    latestNews: "http://news-at.zhihu.com/api/4/news/latest", //最新消息api
    beforeNews: "http://news.at.zhihu.com/api/4/news/before", //获取过往信息api
    newsDetail: "http://news-at.zhihu.com/api/4/news",
    themes: "http://news-at.zhihu.com/api/4/themes",
    themesList: "http://news-at.zhihu.com/api/4/theme",
    comments: "http://news-at.zhihu.com/api/4/story/",
}

/**
 * 网路请求
 */
function request(url, data, successCb, errorCb, completeCb) {
    wx.request({
        url: url,
        method: 'GET',
        data: data,
        success: function(res) {
            utils.isFunction(successCb) && successCb(res.data);
        },
        error: function() {
            utils.isFunction(errorCb) && errorCb();
        },
        complete: function() {
            utils.isFunction(completeCb) && completeCb();
        }
    });
}

//最新消息
function getLatestNews(data, successCb, errorCb, completeCb){
    request(api.latestNews, data, successCb, errorCb, completeCb);
}

//获取过往信息
function getBeforeNews(date, successCb, errorCb, completeCb){
    request(api.beforeNews + "/" + date, {}, successCb, errorCb, completeCb);
}

//获取消息详细
function getNewsDetail(id, successCb, errorCb, completeCb){
    request(api.newsDetail + "/" + id, {}, successCb, errorCb, completeCb);
}

//获取主题日报列表
function getThemes(data, successCb, errorCb, completeCb){
    request(api.themes, data, successCb, errorCb, completeCb);
}

//获取主题日报内容
function getThemesList(id, successCb, errorCb, completeCb){
    request(api.themesList + "/" + id, {}, successCb, errorCb, completeCb);
}

//获取日报短评论
function getShortComments(id, successCb, errorCb, completeCb){
    request(api.comments + "/" + id + "/short-comments", {}, successCb, errorCb, completeCb);
}

//获取日报长评论
function getLongComments(id, successCb, errorCb, completeCb){
    request(api.comments + "/" + id + "/long-comments", {}, successCb, errorCb, completeCb);
}
module.exports = {
  getLatestNews: getLatestNews,
  getBeforeNews: getBeforeNews,
  getNewsDetail: getNewsDetail,
  getThemes: getThemes,
  getThemesList: getThemesList,
  getShortComments: getShortComments,
  getLongComments: getLongComments,
}
