import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import MyDatePicker from '../data_picker/MyDatePicker'
import { MdDelete, MdEditNote } from 'react-icons/md'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { addEmployee, getEmployees } from '../../store/slices/employeeSlice'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

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

const ModalTambah = ({ token, listProvince, getCity, getDistricts, listOfCity, listOfDistricts, getSubDistrict, listOfSubDist, depart }) => {
  
  const dispatch = useDispatch()
  const { success, isLoading, type } = useSelector(
    state => state.employeeSlice.resEmployee
  )
  const modalRef = useRef(null)
  const [value, setValue] = React.useState(0);

  const handleTabs = (event, newValue) => {
    setValue(newValue);
  };

  const formik = useFormik({
    initialValues: {
      id: '',
      nik: '',
      nickname: '',
      nama_karyawan: '',
      departement_id: '',
      email: '',
      phone: '',
      tmptlahir: '',
      tgllahir: '',
      id_card: '',
      karyawan_status: '',
      jenis_kelamin: '',
      status: '',
      alamat: '',
      kota: '',
      starjoin: '',
      sisa_cuti: '',
      spouse_name: '',
      jenis_kelamin_spouse: '',
      tmpt_lahir_spouse: '',
      tgllahir_spouse: '',
      provinsi: '',
      kecamatan: '',
      kelurahan: '',
      kodepos: '',
      emppen: [],
      emppel: [],
      empchild: []
    },
    validationSchema: Yup.object({
      nik: Yup.number().min(1, 'harus lebih 0').required('nik is required'),
      nickname: Yup.string().required('Nickname is required'),
      nama_karyawan: Yup.string().required('Employee name is required'),
      departement_id: Yup.string().required('Department is required'),
      phone: Yup.string()
        .matches(phoneRegExp, 'Phone number is not valid')
        .required('Phone is required'),
      email: Yup.string()
        .email('Must be a valid email')
        .required('Email is required'),
      tmptlahir: Yup.string().required('Birth place is required'),
      tgllahir: Yup.string().required('Birth date is required'),
      id_card: Yup.number().required('ID Card is required'),
      karyawan_status: Yup.string().required('Employee status is required'),
      jenis_kelamin: Yup.string().required('Gender status is required'),
      status: Yup.string().required('Maritial status is required'),
      // alamat: Yup.string().required('Adress is required'),
      kota: Yup.string().required('City person is required'),
      starjoin: Yup.string().required('Start joining person is required'),
      sisa_cuti: Yup.number().required('Remaining Days Off is required'),
      spouse_name: Yup.string(),
      jenis_kelamin_spouse: Yup.string(),
      tmpt_lahir_spouse: Yup.string(),
      tgllahir_spouse: Yup.string(),
      provinsi: Yup.string(),
      kecamatan: Yup.string(),
      kelurahan: Yup.string(),
      kodepos: Yup.string(),
      emppen: Yup.array().min(1, 'Education is required'),
    }),
    onSubmit: values => {
      console.log("Sending data", values)
      dispatch(addEmployee({ data: values, token: token }))
    }
  })

  const formikFam = useFormik({
    initialValues: {
      name_child: '',
      jenis_kelamin: '',
      tmpt_lahir: '',
      tgllahir: ''
    },
    validationSchema: Yup.object({
      name_child: Yup.string(),
      jenis_kelamin: Yup.string(),
      tmpt_lahir: Yup.string(),
      tgllahir: Yup.string(),
    }),
    onSubmit: values => {
      formik.setValues(val => ({
        ...val,
        empchild: val.empchild.concat(values)
      }))
      formikFam.resetForm()
    }
  })

  const removeFam = idx => {
    formik.setValues((val) => ({
      ...val,
      empchild: [...val.empchild.slice(0, idx), ...val.empchild.slice(idx + 1, val.empchild.length)]
    }))
  }

  const formikEdu = useFormik({
    initialValues: {
      jns_pndidikan: '',
      nama_sekolah: '',
      thun_lulus: ''
    },
    validationSchema: Yup.object({
      jns_pndidikan: Yup.string().required('Education status is required'),
      nama_sekolah: Yup.string().required('School name is required'),
      thun_lulus: Yup.string().required('Birth date / Guardiation is required'),
    }),
    onSubmit: values => {
      formik.setValues(val => ({
        ...val,
        emppen: val.emppen.concat(values)
      }))
      formikEdu.resetForm()
    }
  })

  const formikCert = useFormik({
    initialValues: {
      jns_pelatihan: '',
      ket: '',
      wktu_selesai: '',
      upload: ''
    },
    validationSchema: Yup.object({
      jns_pelatihan: Yup.string().required('Certificate status is required'),
      wktu_selesai: Yup.string().required('Birth date / Guardiation is required'),
      upload: Yup.mixed().required('File is required')
    }),
    onSubmit: values => {
      formik.setValues(val => ({
        ...val,
        emppel: val.emppel.concat(values)
      }))
      formikCert.resetForm()
      document.querySelector('#upload').value = ''
    }
  })

  const removeEdu = idx => {
    formik.setValues((val) => ({
      ...val,
      emppen: [...val.emppen.slice(0, idx), ...val.emppen.slice(idx + 1, val.emppen.length)]
    }))
  }

  const removeCert = idx => {
    formik.setValues((val) => ({
      ...val,
      emppel: [...val.emppel.slice(0, idx), ...val.emppel.slice(idx + 1, val.emppel.length)]
    }))
  }

  useEffect(() => {
    if (success) {
      if (type === 'tambah') {
        const modal = window.Modal.getInstance(
          document.querySelector('#tambah')
        )
        modal.hide()
        formik.resetForm({ values: '' })
        dispatch(getEmployees({ token: token }))
      }
    }
  }, [success])

  const handleProvince = (e) => {
    formik.setValues((val) => ({
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
    formik.setValues((val) => ({
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
    formik.setValues((val) => ({
      ...val,
      kecamatan : e.target.value
    }))

    for (let node of e.target.children) {
      if (node.value === e.target.value) {
        getSubDistrict(node.getAttribute('data-id'))
        console.log(node.getAttribute('data-id'));
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
          <div className='modal-content tw-border-none tw-shadow-lg tw-relative tw-flex tw-flex-col tw-w-full tw-pointer-events-auto tw-bg-white tw-bg-clip-padding tw-rounded tw-outline-none tw-text-current'>
            <div className='modal-header tw-bg-[#66B6FF] tw-h-[60px] tw-flex tw-flex-shrink-0 tw-items-center tw-justify-between tw-py-2 tw-px-6'>
              <div className='tw-flex tw-gap-1'>
                  <div className='tw-bg-[#FFFFFF] tw-rounded-full tw-p-[10.97px] tw-w-[41.44px] tw-h-[40px] tw-text-[#66B6FF] '>
                    <MdEditNote size={20}/>
                  </div>
                  <h5
                    className='tw-text-[16px] tw-font-bold tw-leading-normal tw-text-[#FFFFFF] tw-translate-y-2'
                    id='exampleModalLabel'
                  >
                    Add new employee
                  </h5>
                </div>
              {/* <button
                onClick={() => {
                  formik.resetForm({ values: '' })
                  formikEdu.resetForm({ values: '' })
                  formikCert.resetForm({ values: '' })
                }}
                type='button'
                className='tw-btn-close tw-box-content tw-w-4 tw-h-4 tw-p-1 tw-text-black tw-border-none tw-rounded-none tw-opacity-50 focus:tw-shadow-none focus:tw-outline-none focus:tw-opacity-100 hover:tw-text-black hover:tw-opacity-75 hover:tw-no-underline'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button> */}
            </div>
            <div
              ref={modalRef}
              className='modal-body tw-relative tw-py-2 tw-px-6'
            >
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleTabs} aria-label="basic tabs example">
                  <Tab label="Employee" {...a11yProps(0)} />
                  <Tab label="Education" {...a11yProps(1)} />
                  <Tab label="Certificate" {...a11yProps(2)} />
                  <Tab label="Family" {...a11yProps(3)} />
                </Tabs>
              </Box>
              <form>
                <TabPanel value={value} index={0}>
                    <div className='tw-form-group tw-mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        NIK
                      </label>
                      <div className='tw-relative'>
                        <input
                          onChange={formik.handleChange}
                          value={formik.values.nik}
                          type='number'
                          min={0}
                          className={`${formik.touched.nik && formik.errors.nik
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='nik'
                          placeholder='nik'
                        />
                        {formik.touched.nik && formik.errors.nik && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formik.errors.nik}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='tw-form-group tw-mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Nickname
                      </label>
                      <div className='tw-relative'>
                        <input
                          onChange={formik.handleChange}
                          value={formik.values.nickname}
                          type='text'
                          className={`${formik.touched.nickname && formik.errors.nickname
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='nickname'
                          placeholder='Nickname'
                        />
                        {formik.touched.nickname && formik.errors.nickname && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formik.errors.nickname}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='tw-form-group tw-mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Employee Name
                      </label>

                      <div className='tw-relative'>
                        <input
                          onChange={formik.handleChange}
                          value={formik.values.nama_karyawan}
                          type='text'
                          className={`${formik.touched.nama_karyawan &&
                            formik.errors.nama_karyawan
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='nama_karyawan'
                          placeholder='Employee name'
                        />
                        {formik.touched.nama_karyawan &&
                          formik.errors.nama_karyawan && (
                            <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                              {formik.errors.nama_karyawan}
                            </p>
                          )}
                      </div>
                    </div>
                    {/* place here */}
                    <div className='tw-flex tw-gap-6'>
                      <div className='tw-form-group tw-mb-2 tw-w-1/2'>
                        <label
                          htmlFor='exampleInputEmail2'
                          className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                        >
                          Province
                        </label>
                        <div className='tw-relative'>
                          <select
                            onChange={handleProvince}
                            value={formik.values.provinsi}
                            id='provinsi'
                            className={`${formik.touched.provinsi &&
                              formik.errors.provinsi
                              ? `tw-border-red-500`
                              : `tw-border-gray-300`
                              } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                            aria-label='Default select example'
                          >
                            <option value='' disabled>
                              Select Province
                            </option>
                            {listProvince.data.map((val, id) => {
                              return (
                                <option key={id} data-id={val.prov_id} value={val.prov_name}>{val.prov_name}</option>
                              )
                            })}
                            
                          </select>
                          {formik.touched.provinsi &&
                            formik.errors.provinsi && (
                              <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                {formik.errors.provinsi}
                              </p>
                            )}
                        </div>
                      </div>
                      <div className='tw-form-group tw-mb-2 tw-w-1/2'>
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
                            className={`${formik.touched.kota && formik.errors.kota
                              ? `tw-border-red-500`
                              : `tw-border-gray-300`
                              } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                            aria-label='Default select example'
                          >
                            <option value='' disabled>
                              Select City
                            </option>
                            {listOfCity.data.map((val, id) => {
                              return (
                                <option key={id} data-id={val.city_id} value={val.city_name}>{val.city_name}</option>
                              )
                            })}
                            
                          </select>
                          {formik.touched.kota && formik.errors.kota && (
                            <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                              {formik.errors.kota}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='tw-flex tw-gap-6'>
                      <div className='tw-form-group tw-mb-2 tw-w-1/2'>
                        <label
                          htmlFor='exampleInputEmail2'
                          className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                        >
                          District
                        </label>
                        <div className='tw-relative'>
                          <select
                            onChange={handleDistrict}
                            value={formik.values.kecamatan}
                            id='provinsi'
                            className={`${formik.touched.kecamatan &&
                              formik.errors.kecamatan
                              ? `tw-border-red-500`
                              : `tw-border-gray-300`
                              } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                            aria-label='Default select example'
                          >
                            <option value='' disabled>
                              Select Province
                            </option>
                            {listOfDistricts.data.map((val, id) => {
                              return (
                                <option key={id} data-id={val.dis_id} value={val.dis_name}>{val.dis_name}</option>
                              )
                            })}
                            
                          </select>
                          {formik.touched.kecamatan &&
                            formik.errors.kecamatan && (
                              <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                {formik.errors.kecamatan}
                              </p>
                            )}
                        </div>
                      </div>
                      <div className='tw-form-group tw-mb-2 tw-w-1/2'>
                        <label
                          htmlFor='exampleInputEmail2'
                          className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                        >
                          Sub District
                        </label>
                        <div className='tw-relative'>
                          <select
                            onChange={formik.handleChange}
                            value={formik.values.kelurahan}
                            id='kelurahan'
                            className={`${formik.touched.kelurahan && formik.errors.kelurahan
                              ? `tw-border-red-500`
                              : `tw-border-gray-300`
                              } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                            aria-label='Default select example'
                          >
                            <option value='' disabled>
                              Select City
                            </option>
                            {listOfSubDist.data.map((val, id) => {
                              console.log(val);
                              return (
                                <option key={id} data-id={val.subdis_id} value={val.subdis_name}>{val.subdis_name}</option>
                              )
                            })}
                            
                          </select>
                          {formik.touched.kelurahan && formik.errors.kelurahan && (
                            <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                              {formik.errors.kelurahan}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='form-group mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Postal Code
                      </label>
                      <div className='tw-relative'>
                        <input
                          onChange={formik.handleChange}
                          value={formik.values.kodepos}
                          type='text'
                          className={`${formik.touched.kodepos && formik.errors.kodepos
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='kodepos'
                          placeholder='Postal Code'
                        />
                        {formik.touched.kodepos && formik.errors.kodepos && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formik.errors.kodepos}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='tw-flex tw-gap-6'>
                      <div className='tw-form-group tw-mb-2 tw-w-1/2'>
                        <label
                          htmlFor='exampleInputEmail2'
                          className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                        >
                          Birth Place
                        </label>
                        <div className='tw-relative'>
                          <input
                            onChange={formik.handleChange}
                            value={formik.values.tmptlahir}
                            type='text'
                            className={`${formik.touched.tmptlahir && formik.errors.tmptlahir
                              ? `tw-border-red-500`
                              : `tw-border-gray-300`
                              } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                            id='tmptlahir'
                            placeholder='Birth place'
                          />
                          {formik.touched.tmptlahir && formik.errors.tmptlahir && (
                            <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                              {formik.errors.tmptlahir}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className='tw-form-group tw-mb-2 tw-w-1/2'>
                        <label
                          htmlFor='exampleInputEmail2'
                          className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                        >
                          Birth Date
                        </label>
                        <div className='tw-relative'>
                          <input
                            onChange={formik.handleChange}
                            value={formik.values.tgllahir}
                            type='date'
                            className={`${formik.touched.tgllahir && formik.errors.tgllahir
                              ? `tw-border-red-500`
                              : `tw-border-gray-300`
                              } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                            id='tgllahir'
                            placeholder=''
                          />
                          {formik.touched.tgllahir && formik.errors.tgllahir && (
                            <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                              {formik.errors.tgllahir}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='tw-flex tw-gap-6'>
                      <div className='tw-form-group tw-mb-2 tw-w-1/2'>
                        <label
                          htmlFor='exampleInputEmail2'
                          className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                        >
                          Gender
                        </label>
                        <div className='tw-relative'>
                          <select
                            onChange={formik.handleChange}
                            value={formik.values.jenis_kelamin}
                            id='jenis_kelamin'
                            className={`${formik.touched.jenis_kelamin &&
                              formik.errors.jenis_kelamin
                              ? `tw-border-red-500`
                              : `tw-border-gray-300`
                              } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                            aria-label='Default select example'
                          >
                            <option value='' disabled>
                              Pilih Gender
                            </option>
                            <option value='Laki-laki'>Laki-laki</option>
                            <option value='Perempuan'>Perempuan</option>
                          </select>
                          {formik.touched.jenis_kelamin &&
                            formik.errors.jenis_kelamin && (
                              <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                {formik.errors.jenis_kelamin}
                              </p>
                            )}
                        </div>
                      </div>
                      <div className='tw-form-group tw-mb-2 tw-w-1/2'>
                        <label
                          htmlFor='exampleInputEmail2'
                          className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                        >
                          Maritial Status
                        </label>
                        <div className='tw-relative'>
                          <select
                            onChange={formik.handleChange}
                            value={formik.values.status}
                            id='status'
                            className={`${formik.touched.status && formik.errors.status
                              ? `tw-border-red-500`
                              : `tw-border-gray-300`
                              } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                            aria-label='Default select example'
                          >
                            <option value='' disabled>
                              Pilih Maritial Status
                            </option>
                            <option value='Single'>Single</option>
                            <option value='Married'>Married</option>
                            <option value='Divorce'>Divorce</option>
                          </select>
                          {formik.touched.status && formik.errors.status && (
                            <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                              {formik.errors.status}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='form-group mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Department
                      </label>

                      <div className='tw-relative'>
                        <select
                          onChange={formik.handleChange}
                          value={formik.values.departement_id}
                          id='departement_id'
                          className={`${formik.touched.departement_id && formik.errors.departement_id
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          aria-label='Default select example'
                        >
                          <option value='' disabled>
                            Select Department
                          </option>
                          {depart.result.map((val) => {
                            return (
                              <option value={val.id}>{val.namadep}</option>
                            )
                          })}
                        </select>
                        {formik.touched.departement_id &&
                          formik.errors.departement_id && (
                            <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                              {formik.errors.departement_id}
                            </p>
                          )}
                      </div>
                    </div>
                    <div className='form-group mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Phone
                      </label>
                      <div className='tw-relative'>
                        <input
                          onChange={formik.handleChange}
                          value={formik.values.phone}
                          type='text'
                          className={`${formik.touched.phone && formik.errors.phone
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='phone'
                          placeholder='Phone number'
                        />
                        {formik.touched.phone && formik.errors.phone && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formik.errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='form-group mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Email
                      </label>
                      <div className='tw-relative'>
                        <input
                          onChange={formik.handleChange}
                          value={formik.values.email}
                          type='text'
                          className={`${formik.touched.email && formik.errors.email
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='email'
                          placeholder='Email'
                        />
                        {formik.touched.email && formik.errors.email && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formik.errors.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='form-group mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        ID Card
                      </label>
                      <div className='tw-relative'>
                        <input
                          onChange={formik.handleChange}
                          value={formik.values.id_card}
                          type='text'
                          className={`${formik.touched.id_card && formik.errors.id_card
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='id_card'
                          placeholder='ID card'
                        />
                        {formik.touched.id_card && formik.errors.id_card && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formik.errors.id_card}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='form-group mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Remaining Days Off
                      </label>
                      <div className='tw-relative'>
                        <input
                          onChange={formik.handleChange}
                          value={formik.values.sisa_cuti}
                          type='number'
                          min={0}
                          className={`${formik.touched.sisa_cuti && formik.errors.sisa_cuti
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='sisa_cuti'
                          placeholder='Remaining days off'
                        />
                        {formik.touched.sisa_cuti && formik.errors.sisa_cuti && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formik.errors.sisa_cuti}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='tw-flex tw-gap-6'>
                      <div className='tw-form-group tw-mb-2 tw-w-1/2'>
                        <label
                          htmlFor='exampleInputEmail2'
                          className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                        >
                          Employee Status
                        </label>
                        <div className='tw-relative'>
                          <select
                            onChange={formik.handleChange}
                            value={formik.values.karyawan_status}
                            id='karyawan_status'
                            className={`${formik.touched.karyawan_status &&
                              formik.errors.karyawan_status
                              ? `tw-border-red-500`
                              : `tw-border-gray-300`
                              } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                            aria-label='Default select example'
                          >
                            <option value='' disabled>
                              Pilih Employee Status
                            </option>
                            <option value='Permanent'>Permanent</option>
                            <option value='Kontrak'>Kontrak</option>
                          </select>
                          {formik.touched.karyawan_status &&
                            formik.errors.karyawan_status && (
                              <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                {formik.errors.karyawan_status}
                              </p>
                            )}
                        </div>
                      </div>
                      <div className='tw-form-group tw-mb-2 tw-w-1/2'>
                        <label
                          htmlFor='exampleInputEmail2'
                          className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                        >
                          Start Joining
                        </label>

                        <div className='tw-relative'>
                          <input
                            onChange={formik.handleChange}
                            value={formik.values.starjoin}
                            type='date'
                            className={`${formik.touched.starjoin && formik.errors.starjoin
                              ? `tw-border-red-500`
                              : `tw-border-gray-300`
                              } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                            id='starjoin'
                            placeholder=''
                          />
                          {formik.touched.starjoin && formik.errors.starjoin && (
                            <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                              {formik.errors.starjoin}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div className='form-group mb-2 tw-mt-[14px]'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Education Level
                      </label>
                      <div className='tw-relative'>
                        <select
                          id='jns_pndidikan'
                          onChange={formikEdu.handleChange}
                          value={formikEdu.values.jns_pndidikan}
                          className={`${formikEdu.touched.jns_pndidikan && formikEdu.errors.jns_pndidikan
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          aria-label='Default select example'
                        >
                          <option value='' disabled>
                            Select Education Level
                          </option>
                          <option value='SD'>SD</option>
                          <option value='SMP'>SMP</option>
                          <option value='SMA/SMK'>SMA/SMK</option>
                          <option value='D3'>D3</option>
                          <option value='S1'>S1</option>
                        </select>
                        {formikEdu.touched.jns_pndidikan && formikEdu.errors.jns_pndidikan && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formikEdu.errors.jns_pndidikan}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='form-group mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        School / University
                      </label>
                      <div className='tw-relative'>
                        <input
                          onChange={formikEdu.handleChange}
                          value={formikEdu.values.nama_sekolah}
                          type='text'
                          className={`${formikEdu.touched.nama_sekolah && formikEdu.errors.nama_sekolah
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='nama_sekolah'
                          placeholder='School / University'
                        />
                        {formikEdu.touched.nama_sekolah && formikEdu.errors.nama_sekolah && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formikEdu.errors.nama_sekolah}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='form-group mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Graduation Date
                      </label>
                      <div className='tw-relative'>
                        <input
                          onChange={formikEdu.handleChange}
                          value={formikEdu.values.thun_lulus}
                          type='date'
                          className={`${formikEdu.touched.thun_lulus && formikEdu.errors.thun_lulus
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='thun_lulus'
                          placeholder='Graduation Date'
                        />
                        {formikEdu.touched.thun_lulus && formikEdu.errors.thun_lulus && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formikEdu.errors.thun_lulus}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="tw-relative">
                    <div className="tw-relative">
                      <button
                        onClick={formikEdu.handleSubmit}
                        type='button'
                        className='tw-text-[#66B6FF] tw-text-sm tw-font-medium'
                      >
                        + Add new education 
                      </button>
                    </div>
                    </div>
                    {formik.values.emppen.length > 0 && (
                      <div className=' tw-mt-2 tw-px-6 tw-overflow-x-auto'>
                        <table className='tw-max-w-[735px]'>
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
                                Status
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                School / University
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                Birth date / Guardiation
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
                            {formik.values.emppen.map((i, idx) => {
                              return (
                                <tr
                                  key={idx}
                                  className='tw-border-b hover:tw-bg-sky-100'
                                >
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-12'>
                                    {idx + 1}
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                    {i.jns_pndidikan}
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                    {i.nama_sekolah}
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                    {i.thun_lulus}
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap'>
                                    <button
                                      onClick={e => {
                                        e.preventDefault()
                                        removeEdu(idx)
                                      }}
                                      className='hover:tw-text-gray-700 tw-text-gray-500 tw-transition tw-duration-300 tw-ease-in-out'
                                    >
                                      <MdDelete size={18} />
                                    </button>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                </TabPanel>
                <TabPanel value={value} index={2}>
                    {/* <div className='form-group mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Training Type
                      </label>
                      <div className='tw-relative'>
                        <select
                          id='jns_pelatihan'
                          onChange={formikCert.handleChange}
                          value={formikCert.values.jns_pelatihan}
                          className={`${formikCert.touched.jns_pelatihan && formikCert.errors.jns_pelatihan
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          aria-label='Default select example'
                        >
                          <option value='' disabled>
                            Pilih Status
                          </option>
                          <option value='SD'>SD</option>
                          <option value='SMP'>SMP</option>
                          <option value='SMA/SMK'>SMA/SMK</option>
                          <option value='D3'>D3</option>
                          <option value='S1'>S1</option>
                        </select>
                        {formikCert.touched.jns_pelatihan && formikCert.errors.jns_pelatihan && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formikCert.errors.jns_pelatihan}
                          </p>
                        )}
                      </div>
                    </div> */}
                    <div className='form-group mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Certification Type
                      </label>
                      <div className='tw-relative'>
                        <input
                          onChange={formikCert.handleChange}
                          value={formikCert.values.jns_pelatihan}
                          type='text'
                          className={`${formikCert.touched.jns_pelatihan && formikCert.errors.jns_pelatihan
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='jns_pelatihan'
                          placeholder='Certification Type'
                        />
                        {formikCert.touched.jns_pelatihan && formikCert.errors.jns_pelatihan && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formikCert.errors.jns_pelatihan}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='tw-form-group tw-mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Description
                      </label>
                      <textarea
                        onChange={formikCert.handleChange}
                        value={formikCert.values.ket}
                        type='textarea'
                        className='tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-border-gray-300 tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none'
                        id='ket'
                        rows='3'
                        placeholder='Description'
                      />
                    </div>
                    <div className='form-group mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Birth date / Guardiation
                      </label>
                      <div className='tw-relative'>
                        <input
                          onChange={formikCert.handleChange}
                          value={formikCert.values.wktu_selesai}
                          type='date'
                          className={`${formikCert.touched.wktu_selesai && formikCert.errors.wktu_selesai
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='wktu_selesai'
                          placeholder=''
                        />
                        {formikCert.touched.wktu_selesai && formikCert.errors.wktu_selesai && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formikCert.errors.wktu_selesai}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='tw-form-group tw-mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Upload File
                      </label>
                      <div className='tw-relative'>
                        <input
                          onChange={(e) => {
                            formikCert.setValues((val) => ({
                              ...val,
                              upload: e.currentTarget.files[0]
                            }))
                          }}
                          type='file'
                          accept="upload/*"
                          className={`${formikCert.touched.upload && formikCert.errors.upload ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='upload'
                          name="upload"
                          placeholder='Upload file'
                        />
                        {
                          (formikCert.touched.upload && formikCert.errors.upload) &&
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formikCert.errors.upload}
                          </p>
                        }
                      </div>
                    </div>
                    <div className="tw-relative">
                      <button
                        onClick={formikCert.handleSubmit}
                        type='button'
                        className='tw-text-[#66B6FF] tw-text-sm tw-font-medium'
                      >
                        + Add new certificate 
                      </button>
                    </div>
                    {formik.values.emppel.length > 0 && (
                      <div className=' tw-mt-2 tw-px-6 tw-overflow-x-auto'>
                        <table className='tw-max-w-[735px]'>
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
                                Status
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                Description
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                Birth date / Guardiation
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                Certification
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
                            {formik.values.emppel.map((i, idx) => {
                              return (
                                <tr
                                  key={idx}
                                  className='tw-border-b hover:tw-bg-sky-100'
                                >
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-12'>
                                    {idx + 1}
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                    {i.jns_pelatihan}
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                    {i.ket}
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                    {i.wktu_selesai}
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                    <img src={URL.createObjectURL(i.upload)} alt="" className='tw-object-cover' />
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap'>
                                    <button
                                      onClick={e => {
                                        e.preventDefault()
                                        removeCert(idx)
                                      }}
                                      className='hover:tw-text-gray-700 tw-text-gray-500 tw-transition tw-duration-300 tw-ease-in-out'
                                    >
                                      <MdDelete size={18} />
                                    </button>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                </TabPanel>
                {/* is family */}
                <TabPanel value={value} index={3}>
                    <h3 className='tw-text-[#000000] tw-text-[20px] tw-font-semibold tw-mt-[24px]'>Spouse</h3>
                    <div className='form-group mb-2 tw-mt-[14px]'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Spouse Name
                      </label>
                      <div className='tw-relative'>
                        <input
                          onChange={formik.handleChange}
                          value={formik.values.spouse_name}
                          type='text'
                          className={`${formik.touched.spouse_name && formik.errors.spouse_name
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='spouse_name'
                          placeholder='Spouse Name'
                        />
                        {formik.touched.spouse_name && formik.errors.spouse_name && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formik.errors.spouse_name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='form-group mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Gender
                      </label>
                      <div className='tw-relative'>
                        <select
                          id='jns_pndidikan'
                          onChange={formikEdu.handleChange}
                          value={formik.values.jenis_kelamin_spouse}
                          className={`${formik.touched.jenis_kelamin_spouse && formik.errors.jenis_kelamin_spouse
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          aria-label='Default select example'
                        >
                          <option value='' disabled>
                            Pilih Status
                          </option>
                          <option value='Perempuan'>Female</option>
                          <option value='Laki-Laki'>Male</option>
                        </select>
                        {formik.touched.jenis_kelamin_spouse && formik.errors.jenis_kelamin_spouse && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formik.errors.jenis_kelamin_spouse}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='form-group mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Birthplace
                      </label>
                      <div className='tw-relative'>
                        <input
                          onChange={formik.handleChange}
                          value={formik.values.tmpt_lahir_spouse}
                          type='text'
                          className={`${formik.touched.tmpt_lahir_spouse && formik.errors.tmpt_lahir_spouse
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='tmpt_lahir_spouse'
                          placeholder='Spouse Birthplace'
                        />
                        {formik.touched.tmpt_lahir_spouse && formik.errors.tmpt_lahir_spouse && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formik.errors.tmpt_lahir_spouse}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='form-group mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Birthday
                      </label>
                      <div className='tw-relative'>
                        <input
                          onChange={formik.handleChange}
                          value={formik.values.tgllahir_spouse}
                          type='date'
                          className={`${formik.touched.tgllahir_spouse && formik.errors.tgllahir_spouse
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='tgllahir_spouse'
                          placeholder='Birthday'
                        />
                        {formik.touched.tgllahir_spouse && formik.errors.tgllahir_spouse && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formik.errors.tgllahir_spouse}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* remake */}
                    <h3 className='tw-text-[#000000] tw-text-[20px] tw-font-semibold tw-pt-[24px]'>Child</h3>
                    <div className='form-group mb-2 tw-mt-[14px]'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Child Name
                      </label>
                      <div className='tw-relative'>
                        <input
                          onChange={formikFam.handleChange}
                          value={formikFam.values.name_child}
                          type='text'
                          className={`${formikFam.touched.name_child && formikFam.errors.name_child
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='name_child'
                          placeholder='Child Name'
                        />
                        {formikFam.touched.name_child && formikFam.errors.name_child && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formikFam.errors.name_child}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='form-group mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Gender
                      </label>
                      <div className='tw-relative'>
                        <select
                          id='jenis_kelamin'
                          onChange={formikFam.handleChange}
                          value={formikFam.values.jenis_kelamin}
                          className={`${formikFam.touched.jenis_kelamin && formikFam.errors.jenis_kelamin
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          aria-label='Default select example'
                        >
                          <option value='' disabled>
                            Select Gender
                          </option>
                          <option value='Perempuan'>Female</option>
                          <option value='Laki-Laki'>Male</option>
                        </select>
                        {formikFam.touched.jenis_kelamin && formikFam.errors.jenis_kelamin && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formikFam.errors.jenis_kelamin}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='form-group mb-2 tw-mt-[14px]'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Birthplace
                      </label>
                      <div className='tw-relative'>
                        <input
                          onChange={formikFam.handleChange}
                          value={formikFam.values.tmpt_lahir}
                          type='text'
                          className={`${formikFam.touched.tmpt_lahir && formikFam.errors.tmpt_lahir
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='tmpt_lahir'
                          placeholder='Birthplace'
                        />
                        {formikFam.touched.tmpt_lahir && formikFam.errors.tmpt_lahir && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formikFam.errors.tmpt_lahir}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='form-group mb-2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Birthday
                      </label>
                      <div className='tw-relative'>
                        <input
                          onChange={formikFam.handleChange}
                          value={formikFam.values.tgllahir}
                          type='date'
                          className={`${formikFam.touched.tgllahir && formikFam.errors.tgllahir
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          id='tgllahir'
                          placeholder='Birthday'
                        />
                        {formikFam.touched.tgllahir && formikFam.errors.tgllahir && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formikFam.errors.tgllahir}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* addbtn */}
                    <div className="tw-relative">
                      <button
                        onClick={formikFam.handleSubmit}
                        type='button'
                        className='tw-text-[#66B6FF] tw-text-sm tw-font-medium'
                      >
                        + Add new family member 
                      </button>
                    </div>
                    {formik.values.empchild.length > 0 && (
                      <div className=' tw-mt-2 tw-px-6 tw-overflow-x-auto'>
                        <table className='tw-max-w-[735px]'>
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
                                Child Name
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                Gender
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                Birthplace
                              </th>
                              <th
                                scope='tw-col'
                                className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                              >
                                Birthday
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
                            {formik.values.empchild.map((i, idx) => {
                              console.log(i);
                              return (
                                <tr
                                  key={idx}
                                  className='tw-border-b hover:tw-bg-sky-100'
                                >
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-12'>
                                    {idx + 1}
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                    {i.name_child}
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                    {i.jenis_kelamin}
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                    {i.tmpt_lahir}
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                    {i.tgllahir}
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap'>
                                    <button
                                      onClick={e => {
                                        e.preventDefault()
                                        removeFam(idx)
                                      }}
                                      className='hover:tw-text-gray-700 tw-text-gray-500 tw-transition tw-duration-300 tw-ease-in-out'
                                    >
                                      <MdDelete size={18} />
                                    </button>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                </TabPanel>
              </form>
            </div>
            <div className='modal-footer tw-relative tw-flex tw-flex-shrink-0 tw-flex-wrap tw-items-center tw-justify-end tw-py-2 tw-px-6 tw-border-t tw-border-gray-200 tw-rounded-b-md'>
              {
                (formik.touched.emppen && formik.errors.emppen) &&
                <p className='tw-absolute tw-text-red-500 tw-left-6 tw-top-4 tw-m-0 tw-text-xs'>
                  {formik.errors.emppen}
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
