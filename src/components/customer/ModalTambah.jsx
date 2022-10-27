import React, { useRef, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { addCustomer, getCustomer } from '../../store/slices/customerSlice'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { MdDelete, MdEditNote } from 'react-icons/md'
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ModalTambah = ({ val, token, getCity, listProvince, getDistricts, listOfCity, listOfDistricts, getSubDistrict, listOfSubDist }) => {
  const [value, setValue] = React.useState(0);

  const handleTabs = (event, newValue) => {
    setValue(newValue);
  };
  
  const modalRef = useRef(null)
  const dispatch = useDispatch()
  const { success, isLoading, type } = useSelector(state => state.customerSlice.resCustomer)

  const formik = useFormik({
    initialValues: {
      id_customer: "",
      nama: "",
      email: "",
      cuskontak: [],
      addrescus : []

    },
    validationSchema: Yup.object({
      id_customer: Yup.string().required('ID Customer name is required'),
      nama: Yup.string().required('Customer name is required'),
      email: Yup.string().email('Must be a valid email').required('Email is required'),
      cuskontak: Yup.array().min(1, 'Contact person is required'),
      addrescus: Yup.array().min(1, 'Customer Address person is required')
    }),
    onSubmit: (values) => {
      dispatch(addCustomer({ data: values, token: token }))
    }
  })

  const formikCp = useFormik({
    initialValues: {
      contact_person: "",
      email_person: "",
      contact_person_telp: "",

    },
    validationSchema: Yup.object({
      contact_person: Yup.string().required('Contact person name is required'),
      email_person: Yup.string().email('Must be a valid email').required('Email is required'),
      contact_person_telp: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required('Phone number is required'),
    }),
    onSubmit: (values) => {
      formik.setValues(val => ({
        ...val,
        cuskontak: val.cuskontak.concat(values)
      }))
      formikCp.resetForm()
      setTimeout(() => {
        modalRef.current.scrollTop = modalRef.current.scrollHeight;
      }, 10);
    }
  })

  const removeContactPerson = (idx) => {
    formik.setValues((val) => ({
      ...val,
      cuskontak: [...val.cuskontak.slice(0, idx), ...val.cuskontak.slice(idx + 1, val.cuskontak.length)]
    }))
  }

  const removeCusAddress = (idx) => {
    formik.setValues((val) => ({
      ...val,
      addrescus: [...val.addrescus.slice(0, idx), ...val.addrescus.slice(idx + 1, val.addrescus.length)]
    }))
  }

  const formikAc = useFormik({
    initialValues: {
      alamat : '',
      provinsi : '',
      kota : '',
      kecamatan : '',
      kelurahan : '',
      kodepos: '',
      alamat_workshop: '',
      alamat_penerima: ''
    },

    validationSchema: Yup.object({
      alamat: Yup.string(),
      provinsi: Yup.string().required('Province is required'),
      kota: Yup.string().required('Phone number is required'),
      kecamatan : Yup.string().required('Contact person name is required'),
      kelurahan : Yup.string().required('Contact person name is required'),
      kodepos: Yup.string().required('Contact person name is required'),
      alamat_workshop: Yup.string().required('Contact person name is required'),
      alamat_penerima: Yup.string().required('Contact person name is required')
    }),

    onSubmit: (values) => {
      console.log(values);
      formik.setValues(val => ({
        ...val,
        addrescus: val.addrescus.concat(values)
      }))
      formikCp.resetForm()
      setTimeout(() => {
        modalRef.current.scrollTop = modalRef.current.scrollHeight;
      }, 10);
    }
  })

  useEffect(() => {
    if (success) {
      if (type === 'tambah') {
        const modal = window.Modal.getInstance(document.querySelector('#tambah'))
        modal.hide()
        formik.resetForm({ values: '' })
        dispatch(getCustomer({ token: token }))
      }
    }
  }, [success])

  useEffect(() => {
    formik.setValues((values) => ({
      ...values,
      id_customer: val.createID
    }))
  }, [val])

  const handleProvince = (e) => {
    formikAc.setValues((val) => ({
      ...val,
      provinsi : e.target.value
    }))

    for (let node of e.target.children) {
      if (node.value === e.target.value) {
        getCity(node.getAttribute('data-id'))
        return;
      }
    }
  }

  const handleCity = (e) => {
    formikAc.setValues((val) => ({
      ...val,
      kota : e.target.value
    }))

    for (let node of e.target.children) {
      if (node.value === e.target.value) {
        getDistricts(node.getAttribute('data-id'))
        return;
      }
    }
  }

  const handleDistrict = (e) => {
    formikAc.setValues((val) => ({
      ...val,
      kecamatan : e.target.value
    }))

    for (let node of e.target.children) {
      if (node.value === e.target.value) {
        getSubDistrict(node.getAttribute('data-id'))
        return;
      }
    }
  }


  return (
    <React.Fragment>
      <div
        className='modal fade tw-fixed tw-top-0 tw-left-0 tw-hidden tw-w-full tw-h-full tw-outline-none tw-overflow-x-hidden tw-overflow-y-auto'
        id='tambah'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='detail'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg modal-dialog-scrollable tw-relative tw-w-auto tw-pointer-events-none'>
          <div className='modal-content tw-border-none tw-shadow-lg tw-relative tw-flex tw-flex-col tw-w-full tw-pointer-events-auto tw-bg-white tw-bg-clip-padding tw-rounded-md tw-outline-none tw-text-current'>
          <div className='modal-header tw-bg-[#66B6FF] tw-h-[60px] tw-flex tw-flex-shrink-0 tw-items-center tw-justify-between tw-py-2 tw-px-6'>
              <div className='tw-flex tw-gap-1'>
                <div className='tw-bg-[#FFFFFF] tw-rounded-full tw-p-[10.97px] tw-w-[41.44px] tw-h-[40px] tw-text-[#66B6FF] '>
                  <MdEditNote size={20}/>
                </div>
                <h5
                  className='tw-text-[16px] tw-font-bold tw-leading-normal tw-text-[#FFFFFF] tw-translate-y-2'
                  id='exampleModalLabel'
                >
                  Add new customer
                </h5>
              </div>
            </div>
            <div ref={modalRef} className='modal-body tw-relative tw-py-2 tw-px-6'>
              {/* //content */}
              <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleTabs} aria-label="basic tabs example">
                  <Tab label="Customer" {...a11yProps(0)} />
                  <Tab label="Contact Person" {...a11yProps(1)} />
                </Tabs>
              </Box>
                <form>
                  <TabPanel value={value} index={0}>
                    <div className='tw-form-group tw-mb-2 tw-mt-[24px]'>
                        <label
                          htmlFor='exampleInputEmail2'
                          className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                        >
                          ID Customer
                        </label>
                        <div className='tw-relative'>
                          <input
                            disabled
                            type='text'
                            className={`tw-border-gray-300 tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-gray-100 tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                            id='kota'
                            onChange={formik.handleChange}
                            value={formik.values.id_customer}
                            placeholder='ID Customer'
                          />
                        </div>
                    </div>

                    <div className='tw-form-group tw-mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Customer Name
                      </label>
                      <div className='tw-relative'>
                        <input
                          onChange={formik.handleChange}
                          value={formik.values.nama}
                          type='text'
                          className={`${formik.touched.nama && formik.errors.nama ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='nama'
                          placeholder='Customer name'
                        />
                        {
                          formik.touched.nama && formik.errors.nama && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formik.errors.nama}
                          </p>
                        }
                      </div>
                    </div>

                    <div className='tw-form-group tw-mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Office Email
                      </label>
                      <div className='tw-relative'>
                        <input
                          type='text'
                          className={`${formik.touched.email && formik.errors.email ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='email'
                          onChange={formik.handleChange}
                          value={formik.values.email}
                          placeholder='Office email'
                        />
                        {
                          formik.touched.email && formik.errors.email && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formik.errors.email}
                          </p>
                        }
                      </div>
                    </div>
                      
                      {/* office */}
                      <h3 className='tw-text-[#000000] tw-text-[20px] tw-font-semibold tw-pt-[24px]'>Office Address</h3>
                      <div className=' tw-pt-[14px]'>
                        
                        <div className='tw-flex tw-gap-4'>
                          <div className='tw-form-group tw-mb-2'>
                              <label
                                htmlFor='exampleInputEmail2'
                                className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                              >
                                Province
                              </label>
                              <div className='tw-relative'>
                                <select
                                  className={`${formikAc.touched.provinsi && formikAc.errors.provinsi ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                  id='provinsi'
                                  name='provinsi'
                                  onChange={handleProvince}
                                  value={formikAc.values.provinsi}
                                >
                                  <option value="" disabled>
                                    Select Status
                                  </option>
                                  {listProvince.data.map((val, idx) => {
                                      return (
                                        <option key={idx} data-id={val.prov_id} value={val.prov_name} >{val.prov_name}</option>
                                      )
                                  })}
                                  
                                </select>
                                {
                                  formikAc.touched.provinsi && formikAc.errors.provinsi && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                    {formikAc.errors.provinsi}
                                  </p>
                                }
                              </div>
                          </div>
                            
                          <div className='tw-form-group tw-mb-2'>
                              <label
                                htmlFor='exampleInputEmail2'
                                className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                              >
                                City
                              </label>
                              <div className='tw-relative'>
                                <select
                                  onChange={handleCity}
                                  value={formikAc.values.kota}
                                  id='kota'
                                  name='kota'
                                  className={`${formikAc.touched.kota && formikAc.errors.kota ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                  aria-label='Default select example'
                                >
                                  <option value="" disabled>
                                    Select City
                                  </option>
                                  {listOfCity.data.map((e) => {
                                    return (
                                      <option key={e.city_id} data-id={e.city_id} value={e.city_name}>{e.city_name}</option>
                                    )
                                  })}
                                  
                                </select>
                                {
                                  formikAc.touched.kota && formikAc.errors.kota && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                    {formikAc.errors.kota}
                                  </p>
                                }
                              </div>
                          </div>

                          <div className='tw-form-group tw-mb-2'>
                              <label
                                htmlFor='exampleInputEmail2'
                                className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                              >
                                Districts
                              </label>
                              <div className='tw-relative'>
                                <select
                                  onChange={handleDistrict}
                                  value={formikAc.values.kecamatan}
                                  id='kecamatan'
                                  name='kecamatan'
                                  className={`${formikAc.touched.kecamatan && formikAc.errors.kecamatan ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                  aria-label='Default select example'
                                >
                                  <option value="" disabled>
                                    Select Districts
                                  </option>
                                  {listOfDistricts.data.map((e, i) => {
                                    return (
                                      <option data-id={e.dis_id} key={i} value={e.dis_name}>{e.dis_name}</option>
                                    )
                                  })}
                                  
                                </select>
                                {
                                  formikAc.touched.kecamatan && formik.errors.kecamatan && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                    {formikAc.errors.kecamatan}
                                  </p>
                                }
                              </div>
                          </div>

                          <div className='tw-form-group tw-mb-2'>
                              <label
                                htmlFor='exampleInputEmail2'
                                className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                              >
                                Sub District
                              </label>
                              <div className='tw-relative'>
                                <select
                                  onChange={formikAc.handleChange}
                                  value={formikAc.values.kelurahan}
                                  id='kelurahan'
                                  name='kelurahan'
                                  className={`${formikAc.touched.kelurahan && formikAc.errors.kelurahan ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                  aria-label='Default select example'
                                >
                                  <option value="" disabled>
                                    Select Sub District
                                  </option>
                                  {listOfSubDist.data.map((e, i) => {
                                    return (
                                      <option key={i} value={e.subdis_name}>{e.subdis_name}</option>
                                    )
                                  })}
                                  
                                </select>
                                {
                                  formikAc.touched.kelurahan && formikAc.errors.kelurahan && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                    {formik.errors.kelurahan}
                                  </p>
                                }
                              </div>
                          </div>
                        </div>
                        <div className='tw-form-group tw-mb-2'>
                            <label
                              htmlFor='exampleInputEmail2'
                              className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                            >
                              Postal Code
                            </label>
                            <div className='tw-relative'>
                              <input
                                type='text'
                                className={`${formikAc.touched.kodepos && formikAc.errors.kodepos ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                id='kodepos'
                                onChange={formikAc.handleChange}
                                value={formikAc.values.kodepos}
                                placeholder='Postal Code'
                              />
                              {
                                formik.touched.kodepos && formik.errors.kodepos && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                  {formik.errors.kodepos}
                                </p>
                              }
                            </div>
                        </div>
                        <div className='form-group mb-2'>
                            <label
                              htmlFor='exampleInputEmail2'
                              className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                            >
                              Address
                            </label>
                            <div className='tw-relative'>
                              <textarea className={`${formikAc.touched.alamat_penerima && formikAc.errors.alamat_penerima ? `tw-border-red-500` : `tw-border-gray-300`} tw-h-[114px] tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`} onChange={formikAc.handleChange} value={formikAc.values.alamat_penerima} name='alamat_penerima' id='alamat_penerima' cols="30" rows="10"></textarea>
                              {
                                formikAc.touched.alamat_penerima && formik.errors.alamat_penerima && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                  {formikAc.errors.alamat}
                                </p>
                              }
                            </div>
                        </div>

                        <div className='form-group mb-2'>
                            <label
                              htmlFor='exampleInputEmail2'
                              className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                            >
                              Workshop Address
                            </label>
                            <div className='tw-relative'>
                              <textarea className={`${formikAc.touched.alamat_workshop && formikAc.errors.alamat_workshop ? `tw-border-red-500` : `tw-border-gray-300`} tw-h-[114px] tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`} onChange={formikAc.handleChange} value={formikAc.values.alamat_workshop} name='alamat_workshop' id='alamat_workshop' cols="30" rows="10"></textarea>
                              {
                                formikAc.touched.alamat_workshop && formikAc.errors.alamat_workshop && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                  {formikAc.errors.alamat_workshop}
                                </p>
                              }
                            </div>
                          </div>

                          <div className="tw-relative">
                            <button
                              onClick={formikAc.handleSubmit}
                              type='button'
                              className='tw-text-[#66B6FF] tw-text-sm tw-font-medium'
                            >
                              + Add new Address 
                            </button>
                          </div>
                      </div>
                      {
                      formik.values.addrescus.length > 0 &&
                      <div className=' tw-mt-2 tw-px-6 tw-overflow-x-auto'>
                        <table className='tw-w-full'>
                          <thead className='tw-bg-white tw-border-b-2 tw-border-t'>
                            <tr>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                #
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                Provinsi
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                Kota
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                Kecamatan
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                Kelurahan
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                Kode Pos
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              formik.values.addrescus.map((i, idx) => {
                                return (
                                  <tr
                                    key={idx}
                                    className='tw-border-b hover:tw-bg-sky-100'
                                  >
                                    <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-12'>
                                      {idx + 1}
                                    </td>
                                    <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                      {i.provinsi}
                                    </td>
                                    <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                      {i.kota}
                                    </td>
                                    <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                      {i.kecamatan}
                                    </td>
                                    <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                      {i.kelurahan}
                                    </td>
                                    <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                      {i.kodepos}
                                    </td>
                                    <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap'>
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault()
                                          removeCusAddress(idx)
                                        }}
                                        className='hover:tw-text-gray-700 tw-text-gray-500 tw-transition tw-duration-300 tw-ease-in-out'
                                      >
                                        <MdDelete size={18} />
                                      </button>
                                    </td>
                                  </tr>
                                )
                              })
                            }
                          </tbody>
                        </table>
                      </div>
                      }
                      
                      {/* workshop */}
                      {/* <h3 className='tw-text-[#000000] tw-text-[20px] tw-font-semibold tw-pt-[24px]'>Workshop Address</h3>
                      <div className=' tw-pt-[14px]'>
                        <div className='tw-flex tw-gap-4'>
                          <div className='tw-form-group tw-mb-2'>
                              <label
                                htmlFor='exampleInputEmail2'
                                className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                              >
                                Province
                              </label>
                              <div className='tw-relative'>
                                <select
                                  className={`tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                  aria-label='Default select example'
                                  name='province'
                                  onChange={handleProvince}
                                >
                                  <option value="" disabled>
                                    Select Status
                                  </option>
                                  {listProvince.data.map((val, idx) => {
                                      return (
                                        <option key={idx} data-id={val.prov_id} value={val.prov_name} >{val.prov_name}</option>
                                      )
                                  })}
                                  
                                </select>
                                {
                                  formikSr.touched.status_rek && formikSr.errors.status_rek && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                    {formikSr.errors.status_rek}
                                  </p>
                                }
                              </div>
                          </div>
                            
                          <div className='tw-form-group tw-mb-2'>
                              <label
                                htmlFor='exampleInputEmail2'
                                className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                              >
                                City
                              </label>
                              <div className='tw-relative'>
                                <select
                                  onChange={handleCity}
                                  value={formik.values.kota}
                                  id='kota'
                                  name='kota'
                                  className={`${formik.touched.kota && formik.errors.kota ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                  aria-label='Default select example'
                                >
                                  <option value="" disabled>
                                    Select City
                                  </option>
                                  {listOfCity.data.map((e) => {
                                    return (
                                      <option key={e.city_id} data-id={e.city_id} value={e.city_name}>{e.city_name}</option>
                                    )
                                  })}
                                  
                                </select>
                                {
                                  formik.touched.kota && formik.errors.kota && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                    {formik.errors.kota}
                                  </p>
                                }
                              </div>
                          </div>

                          <div className='tw-form-group tw-mb-2'>
                              <label
                                htmlFor='exampleInputEmail2'
                                className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                              >
                                Districts
                              </label>
                              <div className='tw-relative'>
                                <select
                                  onChange={handleDistrict}
                                  value={formik.values.district}
                                  id='district'
                                  name='district'
                                  className={`${formik.touched.district && formik.errors.district ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                  aria-label='Default select example'
                                >
                                  <option value="" disabled>
                                    Select Districts
                                  </option>
                                  {listOfDistricts.data.map((e, i) => {
                                    return (
                                      <option data-id={e.dis_id} key={i} value={e.dis_name}>{e.dis_name}</option>
                                    )
                                  })}
                                  
                                </select>
                                {
                                  formik.touched.district && formik.errors.district && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                    {formik.errors.district}
                                  </p>
                                }
                              </div>
                          </div>

                          <div className='tw-form-group tw-mb-2'>
                              <label
                                htmlFor='exampleInputEmail2'
                                className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                              >
                                Sub District
                              </label>
                              <div className='tw-relative'>
                                <select
                                  onChange={formik.handleChange}
                                  value={formik.values.subdistrict}
                                  id='subdistrict'
                                  name='subdistrict'
                                  className={`${formik.touched.subdistrict && formik.errors.subdistrict ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                  aria-label='Default select example'
                                >
                                  <option value="" disabled>
                                    Select Sub District
                                  </option>
                                  {listOfSubDist.data.map((e, i) => {
                                    return (
                                      <option key={i} value={e.subdis_name}>{e.subdis_name}</option>
                                    )
                                  })}
                                  
                                </select>
                                {
                                  formik.touched.subdistrict && formik.errors.subdistrict && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                    {formik.errors.subdistrict}
                                  </p>
                                }
                              </div>
                          </div>
                        </div>
                        <div className='form-group mb-2'>
                            <label
                              htmlFor='exampleInputEmail2'
                              className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                            >
                              Address
                            </label>
                            <div className='tw-relative'>
                              <textarea className={`${formik.touched.alamat && formik.errors.alamat ? `tw-border-red-500` : `tw-border-gray-300`} tw-h-[114px] tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`} onChange={formik.handleChange} value={formik.values.alamat} name='alamat' id='alamat' cols="30" rows="10"></textarea>
                              {
                                formik.touched.alamat && formik.errors.alamat && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                  {formik.errors.alamat}
                                </p>
                              }
                            </div>
                          </div>

                      </div> */}
                  </TabPanel>

                  <TabPanel value={value} index={1}>
                    {/* ini cuskon */}
                    <div>
                    <div className='tw-relative tw-form-group tw-mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Name
                      </label>
                      <div className='tw-relative'>
                        <input
                          onChange={formikCp.handleChange}
                          value={formikCp.values.contact_person}
                          type='text'
                          className={`${formikCp.touched.contact_person && formikCp.errors.contact_person ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='contact_person'
                          name="contact_person"
                          placeholder='Name'
                        />
                        {
                          (formikCp.touched.contact_person && formikCp.errors.contact_person) &&
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formikCp.errors.contact_person}
                          </p>
                        }
                      </div>
                    </div>
                    <div className='tw-flex tw-gap-6'>
                      {/* bungkus */}
                     
                      <div className='tw-form-group tw-mb-2 tw-w-1/2'>
                        <label
                          htmlFor='exampleInputEmail2'
                          className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                        >
                          Phone Number
                        </label>
                        <div className='tw-relative'>
                          <PhoneInput
                          country={'id'}
                          value={formikCp.values.contact_person_telp}
                          onChange={phone => {
                            formikCp.setValues((val) => ({
                              ...val,
                              contact_person_telp: phone
                            }))
                          }}
                        />

                          {
                            (formikCp.touched.contact_person_telp && formikCp.errors.contact_person_telp) &&
                            <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                              {formikCp.errors.contact_person_telp}
                            </p>
                          }
                        </div>
                      </div>
                      <div className='tw-form-group tw-mb-2 tw-w-1/2'>
                        <label
                          htmlFor='exampleInputEmail2'
                          className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                        >
                          Email
                        </label>
                        <div className='tw-relative'>
                          <input
                            onChange={formikCp.handleChange}
                            value={formikCp.values.email_person}
                            type='text'
                            className={`${formikCp.touched.email_person && formikCp.errors.email_person ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                            id='email_person'
                            name="email_person"
                            placeholder='Email'
                          />
                          {
                            (formikCp.touched.email_person && formikCp.errors.email_person) &&
                            <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                              {formikCp.errors.email_person}
                            </p>
                          }
                        </div>
                      </div>
                    </div>
                    <div className="tw-relative">
                      <button
                        onClick={formikCp.handleSubmit}
                        type='button'
                        className='tw-text-[#66B6FF] tw-text-sm tw-font-medium'
                      >
                        + Add new Bank Account 
                      </button>
                    </div>
                    {
                      formik.values.cuskontak.length > 0 &&
                      <div className=' tw-mt-2 tw-px-6 tw-overflow-x-auto'>
                        <table className='tw-w-full'>
                          <thead className='tw-bg-white tw-border-b-2 tw-border-t'>
                            <tr>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                #
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                Name
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                Phone Number
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                Email
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              formik.values.cuskontak.map((i, idx) => {
                                return (
                                  <tr
                                    key={idx}
                                    className='tw-border-b hover:tw-bg-sky-100'
                                  >
                                    <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-12'>
                                      {idx + 1}
                                    </td>
                                    <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                      {i.contact_person}
                                    </td>
                                    <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                      {i.contact_person_telp}
                                    </td>
                                    <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                      {i.email_person}
                                    </td>
                                    <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap'>
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault()
                                          removeContactPerson(idx)
                                        }}
                                        className='hover:tw-text-gray-700 tw-text-gray-500 tw-transition tw-duration-300 tw-ease-in-out'
                                      >
                                        <MdDelete size={18} />
                                      </button>
                                    </td>
                                  </tr>
                                )
                              })
                            }
                          </tbody>
                        </table>
                      </div>
                    }
                    </div>
                  </TabPanel>
                </form>
              </Box>
            </div>
            <div className='modal-footer tw-relative tw-flex tw-flex-shrink-0 tw-flex-wrap tw-items-center tw-justify-end tw-py-2 tw-px-6 tw-border-t tw-border-gray-200 tw-rounded-b-md'>
              {
                (formik.touched.cuskontak && formik.errors.cuskontak) &&
                <p className='tw-absolute tw-text-red-500 tw-left-6 tw-top-4 tw-m-0 tw-text-xs'>
                  {formik.errors.cuskontak}
                </p>
              }
              <button
                type='button'
                onClick={() => {
                  formik.resetForm({ values: '' })
                }}
                className='tw-text-sm tw-text-[#9A9A9A] tw-font-semibold'
                data-bs-dismiss='modal'
              >
                Cancel
              </button>
              <button
                onClick={formik.handleSubmit}
                type='button'
                className='modal_add_button' 
              >
                {
                  isLoading &&
                  <div className="spinner-border animate-spin tw-inline-block tw-w-4 tw-h-4 tw-border-2 tw-rounded-full tw-mr-2" role="status">
                    <span className="tw-visually-hidden">Loading...</span>
                  </div>
                }
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ModalTambah
