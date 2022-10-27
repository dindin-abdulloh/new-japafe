import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../../axios/api'
import { toast } from 'react-toastify'


export const getProvince = createAsyncThunk(
  'supplierSlice/getProvince',
  async ({token = ''}) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }
    const results = await axios.get(`address/prov`, {
      headers: headers
    })
    return results.data
  }
)

export const getDataCity = createAsyncThunk(
  'supplierSlice/getDataCity',
  async({id = null, token = ''}) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }
    const results = await axios.get(`address/city/${id}`, {
      headers: headers
    })
    
    return results.data
  }
)

export const getDataDistrict = createAsyncThunk(
  'supplierSlice/getDataDistrict',
  async({id = null, token = ''}) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }
    const results = await axios.get(`address/dis/${id}`, {
      headers: headers
    })
    return results.data
  }
)

export const getSubDis = createAsyncThunk(
  'supplierSlice/getSubDis',
  async({id = null, token = ''}) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }
    const results = await axios.get(`address/subdis/${id}`, {
      headers: headers
    })
    return results.data
  }
)

export const getDepart = createAsyncThunk(
  'supplierSlice/getDepart',
  async({token = ''}) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }

    const results = await axios.get(`depart`, {headers : headers})
    return results.data
  }
)


const initialState = {
  dataProvince: {
    data : [],
    isLoading: false
  },

  dataCity: {
    data : [],
    isLoading : false
  },

  dataDistrict : {
    data : [],
    isLoading : false
  },

  dataSubDistrict : {
    data : [],
    isLoading : false
  },

  dataDepart : {
    result: [],
    page : 0,
    limit : 0,
    totalData: 0,
    isLoading: false
  },
}

const generalSlice = createSlice({
  name: 'generalSlice',
  initialState: initialState,
  reducers: {
    setSuccess: (state, action) => {
      state.resSupplier.success = action.payload
    }
  },

  extraReducers: {
    // get Province
    [getProvince.pending] : state => {
      state.dataProvince.isLoading = true
    },
    [getProvince.fulfilled] : (state, action) => {
      state.dataProvince = {
        ...state.dataProvince,
        data : action.payload.msg,
        isLoading: false
      }
    },
    [getProvince.rejected]: state => {
      state.dataProvince.isLoading = false
    },

    // get City
    [getDataCity.pending] : state => {
      state.dataCity.isLoading = true
    },

    [getDataCity.fulfilled] : (state, action) => {
      state.dataCity = {
        ...state.dataCity,
        data : action.payload.msg,
        isLoading : false
      }
    },

    [getDataCity.rejected] : state => {
      state.dataCity.isLoading = false
    },

    // get District
    [getDataDistrict.pending] : state => {
      state.dataDistrict.isLoading = true
    },

    [getDataDistrict.fulfilled] : (state, action) => {
      state.dataDistrict = {
        ...state.dataDistrict,
        data : action.payload.msg
      }
    },

    [getDataDistrict.rejected] : state => {
      state.dataDistrict.isLoading = false
    },

    // get Sub District
    [getSubDis.pending] : state => {
      state.dataSubDistrict.isLoading = true
    },

    [getSubDis.fulfilled] : (state, action) => {
      state.dataSubDistrict = {
        ...state.dataSubDistrict,
        data : action.payload.msg
      }
    },

    [getSubDis.rejected] : state => {
      state.dataSubDistrict.isLoading = false
    },

    [getDataDistrict.rejected] : state => {
      state.dataDistrict.isLoading = false
    },

     // getDepartment
    [getDepart.pending]: state => {
      state.dataDepart.isLoading = true
    },
    [getDepart.fulfilled]: (state, action) => {
      state.dataDepart = {
        ...state.dataDepart,
        result : action.payload.result,
        page : action.payload.page,
        limit : action.payload.limit,
        totalData : action.payload.totalData,
        isLoading: false
      }
    },
    [getDepart.rejected]: state => {
      state.dataDepart.isLoading = false
    },
  }
})

export const { setSuccess } = generalSlice.actions

export default generalSlice.reducer
