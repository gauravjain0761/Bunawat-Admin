export const API_ROUTES = {
    // BASE_URL: 'http://3.110.107.244:5000',
    BASE_URL: 'https://dev.bunawat.com:3000',
    API_VERSION: '/api'
}

export const defaultError = 'Error!'

export const API_URL = {
    adminLogin: "admin_login",

    dashboardDetails: "dashboard_details",

    getCustomers: "customer/getall",
    getCustomer: "customer",
    addCustomer: "customer/add",
    editCustomer: "customer/update",
    deleteCustomers: "customer/remove",

    getResllers: "reseller/getall",
    getResller: "reseller",
    addResller: "resller/add",
    editResller: "reseller/update",
    deleteResllers: "reseller/remove",

    getInfluencers: "influencer/getall",
    getInfluencer: "influencer",
    addInfluencer: "influencer/add",
    editInfluencer: "influencer/update",
    deleteInfluencers: "influencer/remove",
    deleteallInfluencers: "influencer/remove",

    getCollections: "collection/getall",
    getCollection: "collection",
    deleteCollection: "collection/remove",
    addCollection: "collection/add",
    editCollection: "collection/update",

    getOrders: "order/getall",
    getUserNumber: "getuserbyphone",
    getOrder: "order",
    getOrderNotes: "order_notes",
    addOrderNotes: "create_order_notes",
    deleteOrder: "order/remove",
    addOrder: "order/add",
    editOrder: "update_order",
    generateInvoice: "generate_invoice",
    generatePackingSlip: "generate_packing_slip",

    getParentCategorys: "parent_cateogry/getall",
    getParentCategory: "parent_cateogry",
    addParentCategory: "parent_cateogry/add",
    editParentCategory: "parent_cateogry/update",
    deleteParentCategory: "parent_cateogry/remove",

    getParentSubCategorys: "sub_category/getall",
    getParentSubCategory: "sub_category",
    addParentSubCategory: "sub_category/add",
    editParentSubCategory: "sub_category/update",
    deleteParentSubCategory: "sub_category/remove",

    getCategorys: "category/getall",
    getCategory: "category",
    addCategory: "category/add",
    editCategory: "category/update",
    deleteCategory: "category/remove",

    getAttributes: "attribute/getall",
    getAttribute: "attribute",
    addAttribute: "attribute/add",
    deleteAttribute: "attribute/remove",
    editAttribute: "attribute_status_update",

    getVarients: "variant/getall",
    addVarient: "variant/add",
    deleteVarient: "variant/remove",
    editVarient: "varient_status_update",

    getProducts: "product/getall",
    editProductOrdering: "product_ordering",
    editProductFileOrdering: "product_files_ordering",
    getCategoryList: "cateogry_list",
    getCollectionList: "collection_list",
    getProduct: "product",
    addProduct: "product/add",
    editProduct: "product/update",
    deleteProduct: "product/remove",
    deleteProduct: "product/remove",
    getReviewProduct: "product_review_by_product_id",
    editReviewProduct: "product_review",

    getSKUS: "sku/getall",
    addSKU: "sku/add",
    editSKU: "sku/update",
    SKUGetProductID: "sku_get_by_product",
    SKUMediaCreate: "sku_media_create",

    fileUpload: "fileUpload/profile",
    videoFileUpload: "uploadVideo",
    fileUploadProfile: "fileUpload/profile",
    fileUploadProduct: "fileUpload/product",
    fileUploadCategory: "fileUpload/category",
    fileUploadCollection: "fileUpload/collection",
    fileUploadOrderDocs: "fileUpload/order_docs",
    fileRemove: "fileRmove",
    fileStatus: "fileStatus/update",
    SKUFileStatus: "skufileStatus/update",

    getTeams: "team_member/getAll",

    getCoupons: "coupon/getall",
    getCoupon: "coupon",
    addCoupon: "coupon/add",
    editCoupon: "coupon/update",
    deleteCoupon: "coupon/remove",
    couponApply: "coupon_apply",

    shareMedia: "share_media",
    shareMediaFile: "share_media_file"
}