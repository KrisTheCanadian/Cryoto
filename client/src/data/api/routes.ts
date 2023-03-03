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
export const apiRoutePostsCommentOnPost = `${apiRoutePosts}/CommentOnPost`;

// UserProfile
export const apiRouteUserProfile = `${apiEndpoint}userProfile`;
export const apiRouteUserProfileGetUserProfile = `${apiRouteUserProfile}/GetUserProfile`;
export const apiRouteUserProfileGetUserProfilePhoto = `${apiRouteUserProfile}/GetUserProfilePhoto`;
export const apiRouteUserSearch = `${apiRouteUserProfile}/GetSearchResult`;
export const apiRouteUserProfileUpdate = `${apiRouteUserProfile}/Update`;
export const apiRouteUserProfileGetUpcomingAnniversaries = `${apiRouteUserProfile}/GetUpcomingAnniversaries`;
export const apiRouteUserProfileGetTopRecognizers = `${apiRouteUserProfile}/GetTopRecognizers`;

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

// Address
export const apiRouteAddress = `${apiEndpoint}Address`;
export const apiRouteAddressGetAll = `${apiRouteAddress}/GetAll`;
export const apiRouteAddressGetDefaultAddressOrCreate = `${apiRouteAddress}/GetDefaultAddressOrCreate`;
export const apiRouteAddressGetDefaultAddress = `${apiRouteAddress}/GetDefaultAddress`;
export const apiRouteAddressGetAllUserAddresses = `${apiRouteAddress}/GetAllUserAddresses`;
export const apiRouteAddressAdd = `${apiRouteAddress}/Add`;
export const apiRouteAddressDelete = `${apiRouteAddress}/Delete`;
export const apiRouteAddressUpdate = `${apiRouteAddress}/Update`;

// MarketPlace
export const apiRouteMarketPlace = `${apiEndpoint}MarketPlace`;
export const apiRouteMarketPlaceGetAllItems = `${apiRouteMarketPlace}/GetAllItems`;
export const apiRouteMarketPlaceGetItemById = `${apiRouteMarketPlace}/GetItemById`;
export const apiRouteMarketPlaceCompletePurchase = `${apiRouteMarketPlace}/CompletePurchase`;

// Admin
export const apiRouteAdmin = `${apiEndpoint}Admin`;
export const apiRouteAdminUserProfile = `${apiRouteAdmin}/UserProfile`;
export const apiRouteAdminUserProfileGetAllUsers = `${apiRouteAdminUserProfile}/GetAllUsers`;
export const apiRouteAdminUserProfileUpdateUserRoles = `${apiRouteAdminUserProfile}/UpdateUserRoles`;
export const apiRouteAdminUserProfileGetUserByID = `${apiRouteAdminUserProfile}/GetUserById`;

// Comments
export const apiRouteComments = `${apiEndpoint}Comment`;
export const apiRouteCommentsGetCommentsById = `${apiRouteComments}/GetById`;
export const apiRouteCommentsDelete = `${apiRouteComments}/Delete`;
