define({
	login:'/shop/login',
	shop:{
		getShopInfo:'/shop/info/getShopInfo',
		business:'/shop/business/shopId',
		update:'/shop/business/update',
		getShopGoodsInfo:'/shop/goods/getShopGoodsInfo',
		getGoodsPage:'/shop/order/purchase/getGoodsPage',
		purchaseAdd:'/shop/order/purchase/add',
		purchaseList:'/shop/order/purchase/list',
		getOrderInfo:'/shop/order/purchase/getOrderInfo',
		updateStatus:'/shop/info/updateStatus'
	},
	category:{
		list:'/shop/category/list',
		getShopCategoryInfo:'/shop/category/getShopCategoryInfo',
		add:'/shop/category/add',
		update:'/shop/category/update',
		updateStatus:'/shop/category/updateStatus',

	},
	goods:{
		shopCategoryId:'/shop/goods/shopCategoryId',
		getGoodsById:'/gd/goods/getGoodsById',
		goodslist:'/shop/goods/list',
		changeCategory:'/shop/goods/changeCategory'
	},
	wallet:{
		bankCard:{
			getPpshGroup:'/wallet/bankCard/getPpshGroup',
			delBinding:'/wallet/bankCard/delBinding',
			binding:'/wallet/bankCard/binding'
		},
		wallet:{
			getMyWallet:'/wallet/wallet/getMyWallet',
			applyWithdrawals:'/wallet/wtBld/applyWithdrawals',
			getIncomeList:'/wallet/wtBld/getIncomeList',
			getWithdrawalsList:'/wallet/wtBld/getWithdrawalsList'
		}
	},
	backOrder : {
		getList : '/backOrder/order/getList',
		whetherShopReceiveOrder : '/backOrder/order/whetherShopReceiveOrder',
		getOrderInfo:'/backOrder/order/getOrderInfo'
	},
	uploadimg:'/gd/goods/uploadGoodsImg'
});