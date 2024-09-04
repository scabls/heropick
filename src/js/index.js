const { createApp } = Vue
const app = createApp({
  data() {
    return {
      heroArr: [],
      payType: [
        { id: 10, type: 'pay_type', content: '本周免费' },
        { id: 11, type: 'pay_type', content: '新手推荐' },
      ],
      heroType: [
        { id: 100, type: 'all', content: '全部' },
        { id: 3, type: 'hero_type', content: '坦克' },
        { id: 1, type: 'hero_type', content: '战士' },
        { id: 4, type: 'hero_type', content: '刺客' },
        { id: 2, type: 'hero_type', content: '法师' },
        { id: 5, type: 'hero_type', content: '射手' },
        { id: 6, type: 'hero_type', content: '辅助' },
      ],
      pickedId: 100,
      pickedType: 'all',
      search: '',
    }
  },
  computed: {
    href() {
      return ename => `https://pvp.qq.com/web201605/herodetail/${ename}.shtml`
    },
    src() {
      return ename => `https://game.gtimg.cn/images/yxzj/img201606/heroimg/${ename}/${ename}.jpg`
    },
    filteredHeroArr() {
      if (this.search) return this.heroArr.filter(hero => hero.cname.includes(this.search))
      else
        return this.pickedId == 100
          ? this.heroArr
          : this.heroArr.filter(
              hero =>
                hero[this.pickedType] == this.pickedId ||
                hero[this.pickedType + '2'] == this.pickedId
            )
    },
  },
  watch: {
    search: {
      flush: 'post',
      handler() {
        ;(this.pickedId = 100), (this.pickedType = 'all')
        const cnames = document.querySelectorAll('.list a>span')
        cnames.forEach(name => (name.innerHTML = name.innerText))
        if (this.search) {
          cnames.forEach(
            name =>
              (name.innerHTML = name.innerHTML.replace(
                this.search,
                `<span style="color:red">${this.search}</span>`
              ))
          )
        }
      },
    },
  },
})
const instance = app.mount('.container')
axios
  .get('http://project.x-zd.net:3001/apis/herolist')
  .then(res => (instance.heroArr = res.data.data.reverse()))
