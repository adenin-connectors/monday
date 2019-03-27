'use strict';
const api = require('./common/api');

module.exports = async (activity) => {
  try {
    //sending wrong token after initial authorization returns success
    //might be because I am getting error:
    //response.body.response.errors.code => 7074
    //"API is unavailable for your pricing plan. Please upgrade to access"
    const response = await api('/users.json');

    if (Activity.isErrorResponse(response)) return;

    activity.Response.Data = {
      success: response && response.statusCode === 200
    };
  } catch (error) {
    Activity.handleError(error);
    activity.Response.Data.success = false;
  }
};
