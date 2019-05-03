<template>
  <div id="app">
    <ul  v-if="shopListArr.length" ref="scrollAndTop">
      <li v-for="item in shopListArr"  :key="item.id">
        <img :src="img+item.image_path" alt="">
        {{item.image_path}}
      </li>
    </ul>
    <p v-if="touchend" class="empty_data">没有更多了</p>
    <aside class="return_top"  v-if="showBackStatus">
      <svg class="back_top_svg">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
      </svg>
    </aside>

  </div>
</template>

<script>
  import {shopList} from './api/fetch/index'
  import {showBack,animate} from './api/fetch/mUtils'

export default {
  name: 'App',
  data(){
    return {
      latitude: '31.22299', // 当前位置纬度
      longitude: '121.36025', // 当前位置经度
      offset: 0, // 批次加载店铺列表，每次加载20个 limit = 20
      shopListArr:[], // 店铺列表数据
      touchend: false, //没有更多数据
      img:'http://elm.cangdu.org/img/',
      showBackStatus: false, //显示返回顶部按钮
    }
  },
  mounted() {
    this.initDate();
    window.addEventListener('scroll',this.handleScroll,true)
  },
  methods:{
    async initDate(){
      //获取店铺列表数据
      let result=await shopList(this.latitude,this.longitude,this.offset,1);
      console.log(result);
      this.shopListArr=[...result];
      //开始监听scrollTop的值，达到一定程度后显示返回顶部按钮
      showBack(status => {
        this.showBackStatus = status;
      });
    },

    async handleScroll(){
      //变量scrollTop是滚动条滚动时，距离顶部的距离
      var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
//变量windowHeight是可视区的高度
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
//变量scrollHeight是滚动条的总高度
      var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
      //滚动条到底部的条件
      if(scrollTop+windowHeight==scrollHeight){
        //写后台加载数据的函数
        console.log("距顶部"+scrollTop+"可视区高度"+windowHeight+"滚动条总高度"+scrollHeight);
        //数据的定位加20位
            this.offset += 20;
            let res = await shopList(this.latitude, this.longitude, this.offset, 1);
            this.shopListArr = [...this.shopListArr, ...res];
            //当获取数据小于20，说明没有更多数据，不需要再次请求数据
            if (res.length < 20) {
              this.touchend = true;
              return
            }
      }
    },
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
  img{
    width: 67px;
    height: 67px;
  }
.return_top .back_top_svg{
  width: 2rem;
  height: 2rem;
}
.back_top_svg {
  font-style: normal;
  text-decoration: none;
  border: none;
  color: #333;
  font-weight: 400;
  font-family: Microsoft Yahei;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  -webkit-font-smoothing: antialiased;
}
</style>
