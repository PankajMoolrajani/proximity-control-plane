import { axiosInstance } from '/mxr-web/apps/proximity/src/libs/axios/axios.lib'

export const createCrudLog = async (data) => {
  try {
    const response = await axiosInstance.post('/log', {
      data: {
        type: 'PROXIMITY_CRUD_LOG',
        data: data
      }
    })
  } catch (error) {
    console.log(error)
  }
}
