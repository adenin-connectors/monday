'use strict';
const api = require('./common/api');

module.exports = async (activity) => {
  try {
    api.initialize(activity);
    //sending wrong token after initial authorization returns success
    //might be because I am getting error:
    //response.body.response.errors.code => 7074
    //"API is unavailable for your pricing plan. Please upgrade to access"
    const response = await api('/users.json');

    if ($.isErrorResponse(activity, response)) return;

    activity.Response.Data = {
      success: response && response.statusCode === 200
    };
  } catch (error) {
    $.handleError(activity, error);
    activity.Response.Data.success = false;
  }
};
