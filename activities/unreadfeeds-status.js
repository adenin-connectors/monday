'use strict';

const cfActivity = require('@adenin/cf-activity');
const api = require('./common/api');

module.exports = async function (activity) {

  try {
    api.initialize(activity);
    const allUsers = await api(`/users.json`);

    if (!cfActivity.isResponseOk(activity, allUsers)) {
      return;
    }

    let currentUser = getCurrentUser(activity.Context.UserEmail, allUsers);

    const unreadFeeds = await api(`/users/${currentUser.id}/unread_feed.json`);

    if (!cfActivity.isResponseOk(activity, unreadFeeds)) {
      return;
    }

    let feeds = [];
    feeds = unreadFeeds.body;

    let feedsStatus = {
      title: 'Unread Feeds',
      url: currentUser.url,
      urlLabel: 'All feeds',
    };

    let ureadFeedsCount = feeds.length;

    if (ureadFeedsCount != 0) {
      feedsStatus = {
        ...feedsStatus,
        description: `You have ${ureadFeedsCount > 1 ? ureadFeedsCount + "unread feeds" : ureadFeedsCount + " unread feed"}.`,
        color: 'blue',
        value: ureadFeedsCount,
        actionable: true
      };
    } else {
      feedsStatus = {
        ...feedsStatus,
        description: `You have no unread feeds.`,
        actionable: false
      };
    }

    activity.Response.Data = feedsStatus;
  } catch (error) {
    cfActivity.handleError(activity, error);
  }
};
//**comapares email address of the users with activity.Context.UserEmail and returns current user*/
function getCurrentUser(userMail, response) {
  let users = response.body;
  for (let i = 0; i < users.length; i++) {
    if (users[i].email == userMail) {
      return users[i];
    }
  }
}