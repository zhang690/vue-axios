<template>
  <div>
    <div class="title"><h3>axios封装与api管理</h3></div>
    <!-- 
      一：安装 axios 和 ps
            npm install axios ps --save
      二：src文件夹下新疆 api 文件夹，用来管理配置和封装数据处理的api 
            api下新建http.js，用于 基于axios对axios进行二次封装
      三：http.js文件中：
      四：
            
     -->
  </div>
</template>
<script>
import axios from '../../src/api/http';
export default {
  mounted() {
    console.log('process.env', process.env);
    axios
      .get('/api/getAgreement',{
        params:{type:1}
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(JSON.parse(JSON.stringify(err)));
      });
  },
};
</script>
<style lang="less">
.title {
  text-align: center;
}
</style>
