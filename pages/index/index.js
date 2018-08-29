//index.js
//获取应用实例
var app = getApp()
var baseUrl = 'http://zerg.lab/api/v1';

Page({
  onLoad: function(){

  },

  getSuperToken:function() {
    wx.request({
      url: baseUrl + '/token/app',
      data:{
        ac:'warcraft',
        se:'777'
      },
      method:'POST',
      success:function(res){
        console.log(res.data);
        wx.setStorageSync('super_token', res.data.token);
      },
      fail:function(){
        //fail
      },
      complete:function(){
        //complete
      }
    })

  },

  getToken:function(){
    //调用登录接口
    wx.login({
      success:function(res){
        var code = res.code;
        console.log('code');
        console.log(code);
        wx.request({
          url: baseUrl + '/token/user?XDEBUG_SESSION_START=13052',
          data:{
            code:code
          },
          method:'POST',
          success:function(res){
            console.log(res.data);
            wx.setStorageSync('token', res.data.token);
          },
          fail:function(res){
            console.log(res.data);
          }
        })
      }
    })
  },

  checkSession:function(){
    wx.checkSession({
      success:function(){
        console.log('session success');
      },
      fail:function(){
        console.log('session fail');
      }
    })
  },

  delivery:function(){
    wx.request({
      url: baseUrl + '/order/delivery?',
      header:{
        token:wx.getStorageSync('super_token')
      },
      method:'PUT',
      data:{
        //id:wx.getStorageSync('order_id)
        id:293
      },
      success:function(res){
        console.log(res.data);
      }
    })
  },

  //务必在点击支付前，先点击一下申请令牌，确保令牌申请成功
  pay:function(){
    var token = wx.getStorageSync('token');
    var that = this;
    //that.getPreOrder(token, 'A303256065493535')
    wx.request({
      url: baseUrl + '/order?XDEBUG_SESSION_START=11104',
      header:{
        token:token
      },
      data:{
        products:
        [
          {
            product_id:1, count:2
          },
          {
            product_id: 2, count: 3
          }
        ]
      },
      method:'POST',
      success:function(res){
        console.log(res.data);
        // if(res.data.pass){
        //   wx.setStorageSync('order_id', res.data.order_id);
        //   that.getPreOrder(token, res.data.order_id);
        // }
        // else{
        //   console.log('订单未创建成功');
        // }
      }
    })
  },

  //529661ddafc7271a724a39130698809d
  getPreOder:function(token, orderID){
    if(token){
      wx.request({
        url:baseUrl + '/pay/pre_order?',
        method:'POST',
        header:{
          token:token
        },
        data:{
          id:orderID
        },
        success:function(res){
          var preData = res.data;
          wx.requestPayment({
            timeStamp:preData.timeStamp.toString(),
            nonceStr:preData.nonceStr,
            package:preData.package,
            signType:preData.signType,
            paySign:preData.paySign,
            success:function(res){
              console.log(res.data);
            },
            fail:function(error){
              console.log(error);
            }
          })
        }
      })
    }
  },

  formID:function(event){
    console.log(event);
  }
})
