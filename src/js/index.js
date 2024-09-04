const { createApp } = Vue
const app = createApp({
  data() {
    return {
      heroArr: [],
      types: {
        pay_type: [
          { id: 10, content: '本周免费' },
          { id: 11, content: '新手推荐' },
        ],
        hero_type: [
          { id: 0, content: '全部' },
          { id: 3, content: '坦克' },
          { id: 1, content: '战士' },
          { id: 4, content: '刺客' },
          { id: 2, content: '法师' },
          { id: 5, content: '射手' },
          { id: 6, content: '辅助' },
        ],
      },
      query: {
        type: '',
        id: 0,
      },
      keyword: '',
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
      const { type, id } = this.query
      const keyword = this.keyword
      if (keyword)
        return _.cloneDeep(this.heroArr)
          .filter(hero => hero.cname.includes(keyword))
          .map(hero => {
            hero.cname = hero.cname.replace(keyword, `<span style="color:red">${keyword}</span>`)
            return hero
          })
      else
        return id == 0
          ? this.heroArr
          : this.heroArr.filter(hero => hero[type] == id || hero[type + '2'] == id)
    },
  },
  mounted() {
    axios
      .get('http://project.x-zd.net:3001/apis/herolist')
      .then(res => (this.heroArr = res.data.data.reverse()))
  },
  methods: {
    changeType(type, id) {
      this.query.type = type
      this.query.id = id
      this.keyword = ''
    },
    changeKeyword(e) {
      this.keyword = e.target.value.trim()
      this.query.type = ''
      this.query.id = 0
    },
  },
})
app.mount('.container')
