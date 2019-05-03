$(function () {
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
    // 获取一级菜单的数据
    $.ajax({
        url:'/category/queryTopCategory',
        type:'get',
        success:function (res) {
            console.log(res);
            var html=template('category-first',{
                res:res.rows
            })
            $('.links').html(html)
        }
    })
    // 获取二级菜单的数据
    $('.links').on('click','a',function () {
       var id=$(this).attr('data-id');
       $.ajax({
           url:' /category/querySecondCategory',
           data:{
               id:id
           },
           success:function (res) {
               var html=template('category-last',{
                   res:res.rows
               })
               console.log(res);
              $('.brand-list').html(html)

           }
       })
    })
})
