import React, { useEffect, useState, useRef } from 'react'
import MyDatePicker from '../data_picker/MyDatePicker'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { editEmployee, getEmployees } from '../../store/slices/employeeSlice'
import isObjEqual from '../../utils/isObjEqual'
import { MdDelete, MdEditNote } from 'react-icons/md'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import moment from 'moment'

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


const ModalEdit = ({ valAksi, token, depart }) => {
  console.log("EDIT DATA",valAksi);
  const dispatch = useDispatch()
  const [isEdit, setIsEdit] = useState(false)
  const { success, isLoading, type } = useSelector(state => state.employeeSlice.resEmployee)
  const modalRef = useRef(null)
  const [value, setValue] = React.useState(0);

  const handleTabs = (event, newValue) => {
    setValue(newValue);
  };
  const [lastEdu, setLastEdu] = useState({
    status: '',
    desc: '',
    date: ''
  })
  const [lastEduList, setLastEduList] = useState([])

  const onChangeLastEdu = (name, value) => {
    setLastEdu(lastEdu => ({
      ...lastEdu,
      [name]: value
    }))
  }
  const saveLastEdu = () => {
    setLastEduList(lastEduList => [...lastEduList, lastEdu])
    setLastEdu(lastEdu => ({
      ...lastEdu,
      status: '',
      desc: '',
      date: ''
    }))
    setTimeout(() => {
      modalRef.current.scrollTop = modalRef.current.scrollHeight;
    }, 10);
  }

  const removeLastEdu = (idx) => {
    setLastEduList((lastEduList) => [
      ...lastEduList.slice(0, idx),
      ...lastEduList.slice(idx + 1, lastEduList.length)
    ]);
  }

  const formik = useFormik({
    initialValues: {
      id: '',
      nik: '',
      nickname: '',
      nama_karyawan: '',
      departement_id: '',
      email: '',
      tmptlahir: '',
      tgllahir: '',
      id_card: '',
      karyawan_status: '',
      jenis_kelamin: '',
      status: '',
      kota: '',
      starjoin: '',
      endjoin: '',
      spouse_name: '',
      tmpt_lahir_spouse: '',
      tgllahir_spouse: '',
      emppen: [],
      emppel: [],
      empchild: []
    },
    // validationSchema: Yup.object({
    //   nik: Yup.number().required('NIP is required'),
    //   nickname: Yup.string().required('Nickname is required'),
    //   nama_karyawan: Yup.string().required('Employee name is required'),
    //   departement: Yup.string().required('departement_id is required'),
    //   email: Yup.string().email('Must be a valid email').required('Email is required'),
    //   tmptlahir: Yup.string().required('Birth place is required'),
    //   tgllahir: Yup.string().required('Birth date is required'),
    //   id_card: Yup.number().required('ID Card is required'),
    //   karyawan_status: Yup.string().required('Employee status is required'),
    //   jenis_kelamin: Yup.string().required('Gender status is required'),
    //   status: Yup.string().required('Maritial status status is required'),
    //   kota: Yup.string().required('City person is required'),
    //   starjoin: Yup.string().required('Start joining person is required'),
    //   endjoin: Yup.string().required('Remaining days off person is required'),
    // }),
    onSubmit: (values) => {
      dispatch(editEmployee({ data: values, token: token }))
    }
  })

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

  const removeEdu = idx => {
    formik.setValues((val) => ({
      ...val,
      emppen: [...val.emppen.slice(0, idx), ...val.emppen.slice(idx + 1, val.emppen.length)]
    }))
  }

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

  const removeCert = idx => {
    formik.setValues((val) => ({
      ...val,
      emppel: [...val.emppel.slice(0, idx), ...val.emppel.slice(idx + 1, val.emppel.length)]
    }))
  }

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

  useEffect(() => {
    formik.setValues((values) => (
      {
        ...values,
        id: valAksi.id,
        nik: valAksi.nik,
        nickname: valAksi.nickname,
        nama_karyawan: valAksi.nama_karyawan,
        departement_id: valAksi.departement,
        email: valAksi.email,
        tmptlahir: valAksi.tmptlahir,
        tgllahir: valAksi.tgllahir,
        id_card: valAksi.id_card,
        karyawan_status: valAksi.karyawan_status,
        jenis_kelamin: valAksi.jenis_kelamin,
        status: valAksi.status,
        kota: valAksi.kota,
        starjoin: moment(valAksi.starjoin).format('M/DD/YYYY'),
        endjoin: moment(valAksi.endjoin).format('M/DD/YYYY'),
        spouse_name: valAksi.spouse_name,
        tmpt_lahir_spouse: valAksi.tmpt_lahir_spouse,
        tgllahir_spouse: valAksi.tgllahir_spouse,
        emppen: valAksi.emppen,
        emppel : valAksi.emppel,
        empchild: valAksi.empchild
      }
    ))
  }, [valAksi])

  useEffect(() => {
    setIsEdit(isObjEqual(valAksi, formik.values))
  }, [formik.values])

  useEffect(() => {
    if (success) {
      if (type === 'edit') {
        const modal = window.Modal.getInstance(document.querySelector('#edit'))
        modal.hide()
        formik.resetForm({ values: '' })
        dispatch(getEmployees({ token: token }))
      }
    }
  }, [success])

  return (
    <React.Fragment>
      <div
        className='modal fade tw-fixed tw-top-0 tw-left-0 tw-hidden tw-w-full tw-h-full tw-outline-none tw-overflow-x-hidden tw-overflow-y-auto'
        id='edit'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='detail'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable tw-relative tw-w-auto tw-pointer-events-none'>
          <div className='modal-content tw-border-none tw-shadow-lg tw-relative tw-flex tw-flex-col tw-w-full tw-pointer-events-auto tw-bg-white tw-bg-clip-padding tw-rounded-md tw-outline-none tw-text-current'>
            <div className='modal-header tw-bg-[#F6C250] tw-h-[75px] tw-flex tw-flex-shrink-0 tw-items-center tw-justify-between tw-py-2 tw-px-6 tw-border-b tw-border-gray-200 tw-rounded-t'>
              <div className='tw-flex tw-gap-1'>
                <div className='tw-bg-[#FFFFFF] tw-rounded-full tw-p-[10.97px] tw-w-[41.44px] tw-h-[40px] tw-text-[#F6C250] '>
                  <MdEditNote size={20}/>
                </div>

                <div>
                  <h6
                    className='tw-text-[16px] tw-inline-block tw-font-bold tw-leading-normal tw-text-[#FFFFFF]'
                    id='exampleModalLabel'
                  >
                    Edit {formik.values.nama_karyawan}
                  </h6>
                  <br />
                  <h6
                    className='tw-text-[18px] tw-inline-block tw-font-[400] tw-leading-normal tw-text-[#FFFFFF]'
                    id='exampleModalLabel'
                  >
                    Customer NIK #{formik.values.nik}
                  </h6>
                </div>
              </div>
            </div>
            <div className='modal-body tw-relative tw-py-2 tw-px-6'>
              {/* //content */}
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
                        className={`${formik.touched.nik && formik.errors.nik ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                        id='nip'
                        placeholder='NIK'
                      />
                      {
                        formik.touched.nik && formik.errors.nik && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                          {formik.errors.nik}
                        </p>
                      }
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
                      className={`${formik.touched.nama_karyawan && formik.errors.nama_karyawan ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                      id='nama_karyawan'
                      placeholder='Employee name'
                    />
                    {
                      formik.touched.nama_karyawan && formik.errors.nama_karyawan && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                        {formik.errors.nama_karyawan}
                      </p>
                    }
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
                          onChange={formik.handleChange}
                          value={formik.values.jenis_kelamin}
                          className={`${formik.touched.jenis_kelamin && formik.errors.jenis_kelamin
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
                        {formik.touched.jenis_kelamin && formik.errors.jenis_kelamin && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formik.errors.jenis_kelamin}
                          </p>
                        )}
                      </div>
                  </div>
                  <div className='tw-flex tw-gap-6'>
                    <div className='form-group mb-2 tw-w-1/2'>
                        <label
                          htmlFor='exampleInputEmail2'
                          className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                        >
                          Birthplace
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
                            placeholder='Spouse Birthplace'
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
                    <div className='tw-form-group tw-mb-2  tw-w-1/2'>
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
                          className={`${formik.touched.karyawan_status && formik.errors.karyawan_status
                            ? `tw-border-red-500`
                            : `tw-border-gray-300`
                            } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                          aria-label='Default select example'
                        >
                          <option value='' disabled>
                            Select Employee Status
                          </option>
                          <option value='Permanent'>Permanent</option>
                          <option value='Kontrak'>Kontrak</option>
                        </select>
                        {formik.touched.karyawan_status && formik.errors.karyawan_status && (
                          <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formik.errors.karyawan_status}
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
                  <div className='form-group mb-2 tw-w-1/2'>
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
                            Select department
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
                  </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
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
                                Education Level
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
                                    <select
                                      onChange={formik.handleChange}
                                      name={`emppen.${idx}.jenis_kelamin`}
                                      value={i.jns_pndidikan}
                                      id='jns_pndidikan'
                                      className={`tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                      aria-label='Default select example'
                                    >
                                      <option value='' disabled>
                                        Select Education
                                      </option>
                                      <option value='SD'>SD</option>
                                      <option value='SMP'>SMP</option>
                                      <option value='SMA/SMK'>SMA/SMK</option>
                                      <option value='D3'>D3</option>
                                      <option value='S1'>S1</option>
                                    </select>
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                    <input
                                      onChange={formik.handleChange}
                                      value={i.nama_sekolah}
                                      name={`emppen.${idx}.nama_sekolah`}
                                      type='text'
                                      className={`${formikEdu.touched.nama_sekolah && formikEdu.errors.nama_sekolah ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                      id='nama_sekolah'
                                    />
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                    <input
                                        onChange={formik.handleChange}
                                        value={i.thun_lulus}
                                        name={`emppen.${idx}.thun_lulus`}
                                        type='date'
                                        className={`tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                        id='thun_lulus'
                                        placeholder=''
                                    />
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
                                    <input
                                      onChange={formik.handleChange}
                                      value={i.jns_pelatihan}
                                      name={`emppel.${idx}.jns_pelatihan`}
                                      type='text'
                                      className={` tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                      id='jns_pelatihan'
                                    />
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                    <input
                                      onChange={formik.handleChange}
                                      value={i.ket}
                                      name={`emppel.${idx}.ket`}
                                      type='text'
                                      className={` tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                      id='ket'
                                    />
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                    <input
                                        onChange={formik.handleChange}
                                        value={i.wktu_selesai}
                                        name={`emppel.${idx}.wktu_selesai`}
                                        type='date'
                                        className={`tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                        id='wktu_selesai'
                                        placeholder=''
                                    />
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                    {/* <img src={URL.createObjectURL(i.upload)} alt="" className='tw-object-cover' /> */}
                                    <img src={i.upload} alt="" className='tw-object-cover' />
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
                <TabPanel value={value} index={3}>
                  <h3 className='tw-text-[#000000] tw-text-[20px] tw-font-semibold tw-mt-[24px]'>Spouse</h3>
                  <div className='tw-flex tw-gap-6 tw-mt-[14px]'>
                    <div className='tw-form-group tw-mb-2 tw-w-1/2'>
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
                            placeholder=''
                          />
                          {formik.touched.spouse_name && formik.errors.spouse_name && (
                            <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                              {formik.errors.spouse_name}
                            </p>
                          )}
                        </div>
                    </div>
                    <div className='form-group mb-2 tw-w-1/2'>
                        <label
                          htmlFor='exampleInputEmail2'
                          className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                        >
                          Gender
                        </label>

                        <div className='tw-relative'>
                          <select
                            onChange={formik.handleChange}
                            value={formik.values.jenis_kelamin_spouse}
                            id='jenis_kelamin_spouse'
                            className={`${formik.touched.jenis_kelamin_spouse && formik.errors.jenis_kelamin_spouse
                              ? `tw-border-red-500`
                              : `tw-border-gray-300`
                              } tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                            aria-label='Default select example'
                          >
                            <option value='' disabled>
                              Select gender
                            </option>
                            <option value="Laki-Laki">Male</option>
                            <option value="perempuan">Female</option>
                          </select>
                          {formik.touched.jenis_kelamin_spouse &&
                            formik.errors.jenis_kelamin_spouse && (
                              <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                {formik.errors.jenis_kelamin_spouse}
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
                            placeholder=''
                          />
                          {formik.touched.tmpt_lahir_spouse && formik.errors.tmpt_lahir_spouse && (
                            <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                              {formik.errors.tmpt_lahir_spouse}
                            </p>
                          )}
                        </div>
                    </div>
                    <div className='tw-form-group tw-mb-2 tw-w-1/2'>
                        <label
                          htmlFor='exampleInputEmail2'
                          className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                        >
                          Birtday
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
                            placeholder=''
                          />
                          {formik.touched.tgllahir_spouse && formik.errors.tgllahir_spouse && (
                            <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                              {formik.errors.tgllahir_spouse}
                            </p>
                          )}
                        </div>
                    </div>
                  </div>

                  <h3 className='tw-text-[#000000] tw-text-[20px] tw-font-semibold tw-mt-[24px]'>Child</h3>
                  {formik.values.emppel.length > 0 && (
                      <div className=' tw-mt-2 tw-overflow-x-auto'>
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
                              return (
                                <tr
                                  key={idx}
                                  className='tw-border-b hover:tw-bg-sky-100'
                                >
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-12'>
                                    {idx + 1}
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                    <input
                                      onChange={formik.handleChange}
                                      value={i.name_child}
                                      name={`empchild.${idx}.name_child`}
                                      type='text'
                                      className={` tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                      id='name_child'
                                    />
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                    <input
                                        onChange={formik.handleChange}
                                        value={i.jenis_kelamin}
                                        name={`empchild.${idx}.jenis_kelamin`}
                                        type='text'
                                        className={` tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                        id='jenis_kelamin'
                                      />
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                    <select
                                      id='jenis_kelamin'
                                      onChange={formik.handleChange}
                                      value={i.jenis_kelamin}
                                      name={`empchild.${idx}.jenis_kelamin`}
                                      className={`${formik.touched.jenis_kelamin && formik.errors.jenis_kelamin
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
                                      {formik.touched.jenis_kelamin && formik.errors.jenis_kelamin && (
                                        <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                          {formik.errors.jenis_kelamin}
                                        </p>
                                      )}
                                  </td>
                                  <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                    <input
                                          onChange={formik.handleChange}
                                          value={i.tgllahir}
                                          name={`empchild.${idx}.tgllahir`}
                                          type='date'
                                          className={` tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                          id='tgllahir'
                                      />
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
              {/* <form>
                <div className='tw-form-group tw-mb-2'>
                  <label
                    htmlFor='exampleInputEmail2'
                    className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                  >
                    NIP
                  </label>
                  <div className='tw-relative'>
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.nip}
                      type='number'
                      className={`${formik.touched.nip && formik.errors.nip ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                      id='nip'
                      placeholder='NIP'
                    />
                    {
                      formik.touched.nip && formik.errors.nip && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                        {formik.errors.nip}
                      </p>
                    }
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
                      className={`${formik.touched.nickname && formik.errors.nickname ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                      id='nickname'
                      placeholder='Employee name'
                    />
                    {
                      formik.touched.nickname && formik.errors.nickname && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                        {formik.errors.nickname}
                      </p>
                    }
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
                      className={`${formik.touched.nama_karyawan && formik.errors.nama_karyawan ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                      id='nama_karyawan'
                      placeholder='Employee name'
                    />
                    {
                      formik.touched.nama_karyawan && formik.errors.nama_karyawan && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                        {formik.errors.nama_karyawan}
                      </p>
                    }
                  </div>
                </div>
                <div className='form-group mb-2'>
                  <label
                    htmlFor='exampleInputEmail2'
                    className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                  >
                    City
                  </label>
                  <div className='tw-relative'>
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.kota}
                      type='text'
                      className={`${formik.touched.kota && formik.errors.kota ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                      id='kota'
                      placeholder='City'
                    />
                    {
                      formik.touched.kota && formik.errors.kota && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                        {formik.errors.kota}
                      </p>
                    }
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
                        className={`${formik.touched.tmptlahir && formik.errors.tmptlahir ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                        id='tmptlahir'
                        placeholder='Birth place'
                      />
                      {
                        formik.touched.tmptlahir && formik.errors.tmptlahir && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                          {formik.errors.tmptlahir}
                        </p>
                      }
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
                      <MyDatePicker
                        name='tgllahir'
                        value={formik.values.tgllahir}
                        formClassName={`${formik.touched.tgllahir && formik.errors.tgllahir ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal tw-text-left  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                        handleOnChange={(name, date) => {
                          formik.setFieldValue(name, date)
                        }}
                        format={`M/DD/YYYY`}
                      />
                      {
                        formik.touched.tgllahir && formik.errors.tgllahir && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                          {formik.errors.tgllahir}
                        </p>
                      }
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
                        className={`${formik.touched.jenis_kelamin && formik.errors.jenis_kelamin ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                        aria-label='Default select example'
                      >
                        <option value='' disabled>
                          Pilih Gender
                        </option>
                        <option value='laki-laki'>Laki-laki</option>
                        <option value='perempuan'>Perempuan</option>
                      </select>
                      {
                        formik.touched.jenis_kelamin && formik.errors.jenis_kelamin && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                          {formik.errors.jenis_kelamin}
                        </p>
                      }
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
                        className={`${formik.touched.status && formik.errors.status ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                        aria-label='Default select example'
                      >
                        <option value='' disabled>
                          Pilih Maritial Status
                        </option>
                        <option value='single'>Single</option>
                        <option value='married'>Married</option>
                        <option value='divorce'>Divorce</option>
                      </select>
                      {
                        formik.touched.status && formik.errors.status && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                          {formik.errors.status}
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
                    departement_id
                  </label>

                  <div className='tw-relative'>
                    <select
                      onChange={formik.handleChange}
                      value={formik.values.departement}
                      id='departement'
                      className={`${formik.touched.departement && formik.errors.departement ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                      aria-label='Default select example'
                    >
                      <option value='' disabled>
                        Pilih departement_id
                      </option>
                      <option value='1'>One</option>
                      <option value='2'>Two</option>
                      <option value='3'>Three</option>
                    </select>
                    {
                      formik.touched.departement && formik.errors.departement && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                        {formik.errors.departement}
                      </p>
                    }
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
                      className={`${formik.touched.email && formik.errors.email ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                      id='email'
                      placeholder='Phone number'
                    />
                    {
                      formik.touched.email && formik.errors.email && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                        {formik.errors.email}
                      </p>
                    }
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
                      className={`${formik.touched.id_card && formik.errors.id_card ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                      id='id_card'
                      placeholder='ID card'
                    />
                    {
                      formik.touched.id_card && formik.errors.id_card && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                        {formik.errors.id_card}
                      </p>
                    }
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
                    <MyDatePicker
                      name='endjoin'
                      value={formik.values.endjoin}
                      formClassName={`${formik.touched.endjoin && formik.errors.endjoin ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal tw-text-left  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                      handleOnChange={(name, date) => {
                        formik.setFieldValue(name, date)
                      }}
                      format={`M/DD/YYYY`}
                    />
                    {
                      formik.touched.endjoin && formik.errors.endjoin && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                        {formik.errors.endjoin}
                      </p>
                    }
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
                        className={`${formik.touched.karyawan_status && formik.errors.karyawan_status ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                        aria-label='Default select example'
                      >
                        <option value='' disabled>
                          Pilih Employee Status
                        </option>
                        <option value='Permanent'>Permanent</option>
                        <option value='Kontrak'>Kontrak</option>
                      </select>
                      {
                        formik.touched.karyawan_status && formik.errors.karyawan_status && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                          {formik.errors.karyawan_status}
                        </p>
                      }
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
                      <MyDatePicker
                        name='starjoin'
                        value={formik.values.starjoin}
                        formClassName={`${formik.touched.starjoin && formik.errors.starjoin ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal tw-text-left  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                        handleOnChange={(name, date) => {
                          formik.setFieldValue(name, date)
                        }}
                        format={`M/DD/YYYY`}
                      />
                      {
                        formik.touched.starjoin && formik.errors.starjoin && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                          {formik.errors.starjoin}
                        </p>
                      }
                    </div>
                  </div>
                </div>
                <div className='tw-border-y tw-mt-2 tw-mb-2 tw-py-2'>
                  <div className='tw-flex tw-gap-6'>
                    <div className='tw-form-group tw-mb-2 tw-w-1/2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Status
                      </label>
                      <select
                        onChange={e =>
                          onChangeLastEdu(e.target.name, e.target.value)
                        }
                        value={lastEdu.status}
                        className='tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-border-gray-300 tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-blue-600 focus:tw-outline-none'
                        aria-label='Default select example'
                      >
                        <option value='' disabled>
                          Pilih Status
                        </option>
                        <option value='sd'>SD</option>
                        <option value='smp'>SMP</option>
                        <option value='sma/smk'>SMA/SMK</option>
                      </select>
                    </div>
                    <div className='tw-form-group tw-mb-2 tw-w-1/2'>
                      <label
                        htmlFor='exampleInputEmail2'
                        className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                      >
                        Birth date / Guardiation
                      </label>
                      <MyDatePicker
                        name='date'
                        value={lastEdu.date}
                        formClassName={`tw-text-left tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-border-gray-300 tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                        handleOnChange={(name, date) =>
                          onChangeLastEdu(name, date)
                        }
                        format={`M/DD/YYYY`}
                      />
                    </div>
                  </div>
                  <div className='form-group mb-2'>
                    <label
                      htmlFor='exampleInputEmail2'
                      className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                    >
                      Description
                    </label>
                    <textarea
                      name='desc'
                      value={lastEdu.desc}
                      onChange={e =>
                        onChangeLastEdu(e.target.name, e.target.value)
                      }
                      type='text'
                      className='tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-border-gray-300 tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-blue-600 focus:tw-outline-none'
                      id='ppn'
                      placeholder='Description'
                    />
                  </div>
                  <button
                    onClick={saveLastEdu}
                    type='button'
                    className='tw-inline-block tw-px-6 tw-py-2 tw-bg-red-500 tw-text-white tw-font-bold tw-text-xs tw-rounded tw-duration-150 tw-ease-in-out'
                  >
                    Add
                  </button>
                  {lastEduList.length > 0 && (
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
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {lastEduList.map((i, idx) => {
                            return (
                              <tr
                                key={idx}
                                className='tw-border-b hover:tw-bg-sky-100'
                              >
                                <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-12'>
                                  {idx + 1}
                                </td>
                                <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                  {i.status}
                                </td>
                                <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                  {i.desc}
                                </td>
                                <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                  {i.date}
                                </td>
                                <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap'>

                                  <button
                                    onClick={(e) => {
                                      e.preventDefault()
                                      removeLastEdu(idx)
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
                </div>
              </form> */}
            </div>
            <div className='modal-footer tw-flex tw-flex-shrink-0 tw-flex-wrap tw-items-center tw-justify-end tw-py-2 tw-px-6 tw-border-t tw-border-gray-200 tw-rounded-b-md'>
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
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ModalEdit
