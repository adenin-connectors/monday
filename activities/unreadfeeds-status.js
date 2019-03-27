'use strict';
const api = require('./common/api');

module.exports = async function (activity) {

  try {
    const allUsers = await api(`/users.json`);

    if (Activity.isErrorResponse(allUsers)) return;

    let currentUser = getCurrentUser(activity.Context.UserEmail, allUsers);

    const unreadFeeds = await api(`/users/${currentUser.id}/unread_feed.json`);

    if (Activity.isErrorResponse(unreadFeeds)) return;

    let feeds = [];
    feeds = unreadFeeds.body;

    let feedsStatus = {
      title: T('Unread Feeds'),
      link: currentUser.url,
      linkLabel: T('All Feeds'),
    };

    let unreadFeedsCount = feeds.length;

    if (unreadFeedsCount != 0) {
      feedsStatus = {
        ...feedsStatus,
        description: unreadFeedsCount > 1 ? T("You have {0} unread feeds.", unreadFeedsCount)
          : T("You have 1 unread feed."),
        color: 'blue',
        value: unreadFeedsCount,
        actionable: true
      };
    } else {
      feedsStatus = {
        ...feedsStatus,
        description: T(`You have no unread feeds.`),
        actionable: false
      };
    }

    activity.Response.Data = feedsStatus;
  } catch (error) {
    Activity.handleError(error);
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