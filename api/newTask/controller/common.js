/*
 * Html的Head部分配置
 * */
exports.HTMLHEAD = function (title, keyword, description) {
    return {
        pageTitle: title || '标题',
        pageKeywords: keyword || '关键词',
        pageDescription: description || '描述'
    }
}