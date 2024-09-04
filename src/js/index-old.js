// 立即执行异步函数
;(async url => {
  const dataJSON = await (url =>
    new Promise(function (resolve) {
      //创建XMLHttpRequest对象
      const xhr = new XMLHttpRequest()
      //设置请求
      xhr.open('GET', url)
      //发送请求
      xhr.send()
      //通过xhr的一个事件监听来获取请求的响应状态和数据
      xhr.onreadystatechange = function () {
        //readyState这个状态会从0逐渐变化到4 如果变到了4说明请求响应成功了
        if (xhr.readyState === 4) {
          //说明请求数据成功了 可以将当前的Promise修改为成功态 并且存储数据
          resolve(xhr.response)
        }
      }
    }))(url)
  /* ===========初始展示=========== */
  // 获取英雄数据数组
  const dataArr = JSON.parse(dataJSON).data.reverse()
  // 定义展示函数
  function displayHero(dataArr) {
    // 获取展示容器
    const ul = document.querySelector('.list')
    ul.innerHTML = dataArr
      .map(
        item => `
        <li>
          <a href="https://pvp.qq.com/web201605/herodetail/${item.ename}.shtml" target="_blank">
            <img src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/${item.ename}/${item.ename}.jpg" />
            <span>${item.cname}</span>
          </a>
        </li>
      `
      )
      .join('') /* 注意将数组再转成一个字符串，分隔符空 */
  }
  // 调用展示函数
  displayHero(dataArr)
  /* ==========实现单选框效果========= */
  const radios = document.querySelectorAll('.radio')
  // 编写自定义单选框单选效果函数
  function setRadioStyle(radio) {
    // 注意，必须先排除再设置
    // 选择已经有checked类的元素
    const preRadio = document.querySelector('.radio.checked')
    // 如果存在，去除checked类
    if (preRadio) preRadio.classList.remove('checked')
    // 给指定单选框添加样式
    radio.classList.add('checked')
  }
  radios.forEach(radio => {
    // 给每个按钮添加点击事件
    radio.addEventListener('click', function () {
      // 单选被点击的按钮
      setRadioStyle(radio)
      // 根据点击的按钮筛选数据并展示
      // 过滤出数组中指定属性等于指定值的元素
      // 筛选依据：按钮上的自定义属性type和value
      if (this.dataset.type === 'all') displayHero(dataArr)
      else
        displayHero(
          dataArr.filter(
            item =>
              item[this.dataset.type] == this.dataset.value ||
              item[this.dataset.type + '2'] == this.dataset.value
          )
        )
    })
  })
  /* ==========实现搜索框功能========== */
  // 选中搜索框，监听输入事件
  const input = document.querySelector('.input input')
  input.addEventListener('input', function () {
    // 只要输入字符，就将单选复原到全部按钮
    setRadioStyle(document.querySelector('[data-type="all"]'))
    // 获取输入的字符
    const keyword = input.value
    // 根据英雄名是否包含输入的字符，过滤数组并展示
    // 因为当keyword==''时，过滤出的数组仍是原数组，结果是符合要求的，不做多余判断
    // 但为了节省性能资源，还是做下判断吧，顺便改成全输入空格也不筛选
    if (keyword.trim() == '') return displayHero(dataArr)
    displayHero(dataArr.filter(item => item.cname.includes(keyword)))
    // 现在为展示的关键词设置红色样式
    const cnames = document.querySelectorAll('.list span')
    // 将关键词替换为加了内联样式的关键词
    cnames.forEach(
      name =>
        (name.innerHTML = name.innerHTML.replace(
          keyword,
          `<span style="color:red">${keyword}</span>`
        ))
    )
    // 当然替换还有其他方式，详见对ul的innerHTML里所有关键词进行替换（replaceAll）
  })
})('http://project.x-zd.net:3001/apis/herolist')
