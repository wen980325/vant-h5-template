import { areaList } from '@vant/area-data'
import { cloneDeep } from 'lodash'

const getArea = () => {
  let provinceArr = Object.keys(areaList.province_list),
    cityArr = Object.keys(areaList.city_list),
    countyArr = Object.keys(areaList.county_list),
    getChild = (list, arr, num, isLast) => {
      return arr.map((v) => {
        let value = v.slice(0, num),
          text = list[v]
        return {
          value,
          text,
          children: isLast ? null : [],
        }
      })
    },
    setChild = (list, childList, num) => {
      let arr = cloneDeep(list)
      arr.map((v) => {
        v.children = childList.filter((e) => e.value.slice(0, num).includes(v.value))
      })
      return arr
    },
    provinceList = getChild(areaList.province_list, provinceArr, 2, false),
    cityList = getChild(areaList.city_list, cityArr, 4, false),
    countyList = getChild(areaList.county_list, countyArr, 6, true)

  let cityFinishList = setChild(cityList, countyList, 4)
  let provinceFinishList = setChild(provinceList, cityFinishList, 2)
  return provinceFinishList
}

export const area = getArea() ?? []
