export const apiEndpoint =
  process.env.VITE_API_BASE_URL || 'https://localhost:7175/';

export const clientEndpoint =
  process.env.VITE_CLIENT_BASE_URL || 'http://localhost:5173/';

// Authentication
export const clientEndpointAuth = `${clientEndpoint}authentication`;

// Posts
export const apiRoutePosts = `${apiEndpoint}posts`;
// Post Feed
export const apiRoutePostsGetUserFeed = `${apiRoutePosts}/GetUserFeedPaginated`;
export const apiRoutePostsGetUserProfileFeed = `${apiRoutePosts}/GetUserProfileFeedPaginated`;
export const apiRoutePostsGetAllPosts = `${apiRoutePosts}/GetAllPosts`;
// Crud
export const apiRoutePostsGetPostById = `${apiRoutePosts}/GetPostById`;
export const apiRoutePostsCreatePost = `${apiRoutePosts}/Create`;
export const apiRoutePostsUpdatePost = `${apiRoutePosts}/Update`;
export const apiRoutePostsDeletePost = `${apiRoutePosts}/Delete`;
export const apiRoutePostsReactPost = `${apiRoutePosts}/React`;

// UserProfile
export const apiRouteUserProfile = `${apiEndpoint}userProfile`;
export const apiRouteUserProfileGetUserProfile = `${apiRouteUserProfile}/GetUserProfile`;
export const apiRouteUserProfileGetUserProfilePhoto = `${apiRouteUserProfile}/GetUserProfilePhoto`;
export const apiRouteUserProfileGetUserByID = `${apiRouteUserProfile}/GetUserById`;
export const apiRouteUserGetAllUsers = `${apiRouteUserProfile}/GetAllUsers`;
export const apiRouteUserSearch = `${apiRouteUserProfile}/GetSearchResult`;

// Crypto
export const apiRouteCrypto = `${apiEndpoint}Crypto`;
export const apiRouteCryptoGetTokenBalance = `${apiRouteCrypto}/GetTokenBalance`;
export const apiRouteCryptoSelfTransferTokens = `${apiRouteCrypto}/SelfTransferTokens`;

// Transactions
export const apiRouteTransactions = `${apiEndpoint}Transaction`;
export const apiRouteTransactionsGetTransactionsBySenderOId = `${apiRouteTransactions}/GetTransactionsBySenderOId`;
export const apiRouteTransactionsGetTransactionsByReceiverOId = `${apiRouteTransactions}/GetTransactionsByReceiverOId`;

// Notifications

export const apiRouteNotifications = `${apiEndpoint}Notification`;
export const apiRouteNotificationsGetNotifications = `${apiRouteNotifications}/GetNotifications`;
export const apiRouteNotificationsReadNotification = `${apiRouteNotifications}/ReadNotification`;
export const apiRouteNotificationsGetNotificationsPaginated = `${apiRouteNotifications}/GetNotificationsPaginated`;
