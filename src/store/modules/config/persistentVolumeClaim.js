import request from '@/lib/request'
import { api, date } from '@/utils/common'
import moment from 'moment'

const resource = {
  namespaced: true,
  state: {
    dataList: [],
    detailInfo: {
      persistentVolumeClaimIdx: null,
      name: null,
      namespace: null,
      uid: null,
      status: null,
      accessType: null,
      storageClass: null,
      createdAt: null,
      clusterName: '',
      projectIdx: null,
    },
  },

  getters: {
    dataList(state) {
      return state.dataList
    },
    dataListSize(state) {
      return state.dataList.length
    },
    detailInfo(state) {
      return state.detailInfo
    },
  },

  mutations: {
    // state 데이터 초기화
    initPersistentVolumeClaimState(state) {
      state.dataList = []
      state.detailInfo = {
        persistentVolumeClaimIdx: null,
        name: '',
        namespace: null,
        uid: null,
        status: null,
        accessType: null,
        storageClass: null,
        createdAt: null,
        clusterName: '',
        projectIdx: null,
      }
    },
    initPersistentVolumeClaimDataList(state) {
      state.dataList = []
    },

    // [Persistent Volume Claim 리스트 정보] 객체 생성
    changeList(state, payload) {
      const { data } = payload

      console.log('data === ', data)

      const { result } = data
      const dataList = []
      result.content.forEach(e => {
        console.log('e', e)
        const item = {
          persistentVolumeClaimIdx: e.id,
          name: e.name,
          namespace: e.namespace,
          status: e.status,
          storageCapacity: e.storageCapacity,
          storageRequest: e.storageRequest,
          accessType: e.accessType,
          storageClass: e.storageClass,
          age: `${date.getDiffFromToday(e.age)}`,
        }

        dataList.push(item)
      })
      state.dataList = dataList
    },

    // [Persistent Volume Claim 상세 정보] 객체 생성
    changeDetailInfo(state, payload) {
      state.detailInfo = {}

      const { data } = payload
      const { result } = data

      if (result) {
        state.detailInfo.persistentVolumeClaimIdx =
          result.persistentVolumeClaimIdx
        state.detailInfo.name = result.name
        state.detailInfo.namespace = result.namespace
        state.detailInfo.uid = result.uid
        state.detailInfo.status = result.status
        state.detailInfo.accessType = result.accessType
        state.detailInfo.storageClass = result.storageClass
        state.detailInfo.createdAt = moment(result.createdAt).format(
          'YYYY-MM-DD HH:mm:ss',
        )
        state.detailInfo.clusterName = result.clusterName
        state.detailInfo.projectIdx = result.projectIdx
      }
    },
  },

  actions: {
    // Persistent Volume Claim 리스트 정보 조회 요청
    async getList({ commit }, payload) {
      const param = {
        page: 1,
        size: 100,
        sort: 'desc',
        property: 'persistentVolumeClaimIdx',
        clusterIdx: payload.clusterIdx,
        namespaceIdx: payload.namespaceIdx,
      }

      // getAllData: 페이징정보를 활용하여 순차적으로 전체 데이터를 조회하는 함수 호출
      // getAllData는 옵션이다. 백엔드 API에 paging 구현이 되어있을 경우, 전체 데이터를 조회하고 싶을 경우 사용한다.
      // common.js 참고
      const response = await api.getAllData(
        request.getPersistentVolumeClaimListUsingGET,
        param,
      )

      commit('changeList', response)
    },

    // Persistent Volume Claim 상세 정보 조회 요청
    async getDetail({ commit }, payload) {
      const response = await request.getPersistentVolumeClaimUsingGET(payload)
      commit('changeDetailInfo', response)
    },

    // Persistent Volume Claim yaml 정보 조회 요청
    async getYaml(context, payload) {
      const response = await request.getPersistentVolumeClaimYamlUsingGET(
        payload,
      )
      return response
    },

    // Persistent Volume Claim 생성 요청
    async createPersistentVolumeClaim(context, payload) {
      const response = await request.registerPersistentVolumeClaimUsingPOST(
        payload,
      )
      return response
    },

    // Persistent Volume Claim 수정 요청
    async updatePersistentVolumeClaim(context, payload) {
      const response = await request.updatePersistentVolumeClaimUsingPUT(
        payload,
      )
      return response
    },

    // Persistent Volume Claim 삭제 요청
    async deletePersistentVolumeClaim(context, payload) {
      const response = await request.deletePersistentVolumeClaimUsingDELETE(
        payload,
      )
      return response
    },
  },
}

export default resource
