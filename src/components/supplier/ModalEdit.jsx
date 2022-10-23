import React, { useEffect, useState, useRef } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { editSupplier, getSupplier } from '../../store/slices/supplierSlice'
import isObjEqual from '../../utils/isObjEqual'
import '../css/editModal.css'
import { MdEditNote, MdDelete } from 'react-icons/md'
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

const ModalEdit = ({ valAksi, token, getCity, listProvince, getDistricts, listOfCity, listOfDistricts }) => {
  console.log(valAksi);
  const modalRef = useRef(null)
  const [isEdit, setIsEdit] = useState(false)
  const dispatch = useDispatch()
  const { success, isLoading, type } = useSelector(
    state => state.supplierSlice.resSupplier
  )
  const [value, setValue] = React.useState(0);

  const handleTabs = (event, newValue) => {
    setValue(newValue);
  };

  const formik = useFormik({
    initialValues: {
      id: '',
      suplier_type: '',
      id_suplier: '',
      sup_name: '',
      alamat: '',
      kota: '',
      npwp : '',
      phone: '',
      email: '',
      // bank_akun: '',
      // akun_name: '',
      // akun_number: '',
      // contact_person_sup: '',
      ppn: '',
      pph: '',
      suprek : [],
      cuskontak: []
    },
    validationSchema: Yup.object({
      suplier_type: Yup.string().required('Supplier type is required'),
      sup_name: Yup.string().required('Supplier name is required'),
      alamat: Yup.string().required('Address is required'),
      kota: Yup.string().required('City is required'),
      npwp : Yup.string().required('NPWP is required'),
      email: Yup.string().email('Must be a valid email').required('Email is required'),
      // bank_akun: Yup.string().required('Bank name is required'),
      // akun_name: Yup.string().required('Account name is required'),
      // akun_number: Yup.string().required('Account number is required'),
      phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required('Office phone is required'),
      // contact_person_sup: Yup.string().required('Contact person is required'),
      ppn: Yup.number().required('PPN is required'),
      pph: Yup.number().required('PPh is required'),
      suprek: Yup.array(),
      cuskontak : Yup.array()
    }),
    onSubmit: values => {
      dispatch(editSupplier({ data: values, token: token }))
    }
  })

  useEffect(() => {
    formik.setValues(values => ({
      ...values,
      id: valAksi.id,
      suplier_type: valAksi.suplier_type,
      id_suplier: valAksi.id_suplier,
      sup_name: valAksi.sup_name,
      alamat: valAksi.alamat,
      kota: valAksi.kota,
      npwp: valAksi.npwp,
      phone: valAksi.phone,
      email: valAksi.email,
      // bank_akun: valAksi.bank_akun,
      // akun_name: valAksi.akun_name,
      // akun_number: valAksi.akun_number,
      // contact_person_sup: valAksi.contact_person_sup,
      ppn: valAksi.ppn,
      pph: valAksi.pph,
      cuskontak: valAksi.cuskontak,
      suprek: valAksi.suprek
    }))
  }, [valAksi])

  const formikSr = useFormik({
    initialValues: {
      koderek: "",
      namabank: "",
      namaakun: "",
      status_rek: "",

    },
    validationSchema: Yup.object({
      koderek: Yup.string().required('Contact person name is required'),
      namabank: Yup.string().required('Must be a valid email').required('Email is required'),
      namaakun: Yup.string().required('Phone number is required'),
      status_rek: Yup.string().required('Phone number is required'),
    }),
    onSubmit: (values) => {
      formik.setValues(val => ({
        ...val,
        suprek: val.suprek.concat(values)
      }))
      formikSr.resetForm()
      setTimeout(() => {
        modalRef.current.scrollTop = modalRef.current.scrollHeight;
      }, 10);
    }
  })

  const removeSupplierBank = (idx) => {
    formik.setValues((val) => ({
      ...val,
      suprek: [...val.suprek.slice(0, idx), ...val.suprek.slice(idx + 1, val.cuskontak.length)]
    }))
  }

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

  useEffect(() => {
    setIsEdit(isObjEqual(valAksi, formik.values))
  
  }, [formik.values])

  useEffect(() => {
    if (success) {
      if (type === 'edit') {
        const modal = window.Modal.getInstance(document.querySelector('#edit'))
        modal.hide()
        formik.resetForm({ values: '' })
        dispatch(getSupplier({ token: token }))
      }
    }
  }, [success])

  const handleProvince = (e) => {
    getCity(e.target.value)
  }

  const handleCity = (e) => {
    formik.setValues((val) => ({
      ...val,
      kota : e.target.value
    }))
    getDistricts(e.target.value)
  }

  const handleDistrict = (e) => {
    // console.log(e);
  }

  return (
    <React.Fragment>
      <div
        className='modal fade is_modal_edit'
        id='edit'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='detail'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable tw-relative tw-w-auto tw-pointer-events-none'>
          <div className='modal-content tw-border-none tw-shadow-lg tw-relative tw-flex tw-flex-col tw-w-full tw-pointer-events-auto tw-bg-white tw-bg-clip-padding tw-rounded-md tw-outline-none tw-text-current'>
            <div className='modal-header tw-h-[75px] tw-bg-[#F6C250] tw-flex tw-flex-shrink-0 tw-items-center tw-justify-between tw-py-2 tw-px-6'>
              <div className='tw-flex tw-gap-1'>
                <div className='tw-bg-[#FFFFFF] tw-rounded-full tw-p-[10.97px] tw-w-[41.44px] tw-h-[40px] tw-text-[#F6C250] '>
                  <MdEditNote size={20}/>
                </div>

                <div>
                  <h6
                    className='tw-text-[16px] tw-inline-block tw-font-bold tw-leading-normal tw-text-[#FFFFFF]'
                    id='exampleModalLabel'
                  >
                    Edit {formik.values.sup_name}
                  </h6>
                  <br />
                  <h6
                    className='tw-text-[18px] tw-inline-block tw-font-[400] tw-leading-normal tw-text-[#FFFFFF]'
                    id='exampleModalLabel'
                  >
                    Supplier ID #{formik.values.id_suplier}
                  </h6>
                </div>
              </div>
              {/* <button
                onClick={() => {
                  formik.resetForm({ values: '' })
                }}
                type='button'
                className='tw-btn-close tw-box-content tw-w-4 tw-h-4 tw-p-1 tw-text-black tw-border-none tw-rounded-none tw-opacity-50 focus:tw-shadow-none focus:tw-outline-none focus:tw-opacity-100 hover:tw-text-black hover:tw-opacity-75 hover:tw-no-underline'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button> */}
            </div>
            <div className='modal-body tw-relative tw-py-2 tw-px-6'>
              {/* //content */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleTabs} aria-label="basic tabs example">
                  <Tab label="Supplier" {...a11yProps(0)} />
                  <Tab label="Contact Person" {...a11yProps(1)} />
                </Tabs>
              </Box>
                <form>
                  <TabPanel value={value} index={0}>
                      <h3 className='tw-text-[#000000] tw-text-[20px] tw-font-semibold tw-pt-[24px]'>Supplier</h3>
                      <div className='tw-pt-[14px]'>
                        <div>
                          <div className='tw-form-group tw-mb-2'>
                            <label
                              htmlFor='exampleInputEmail2'
                              className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                            >
                              Type Supplier
                            </label>
                            <div className='tw-relative'>
                              <select
                                onChange={formik.handleChange}
                                value={formik.values.suplier_type}
                                id='suplier_type'
                                name='suplier_type'
                                className={`${formik.touched.suplier_type && formik.errors.suplier_type ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                aria-label='Default select example'
                              >
                                <option value="" disabled>
                                  Pilih Jenis
                                </option>
                                <option value='Material Suplier'>Material Supplier</option>
                                <option value='Services Vendor'>Services Vendor</option>
                              </select>
                              {
                                formik.touched.suplier_type && formik.errors.suplier_type && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                  {formik.errors.suplier_type}
                                </p>
                              }
                            </div>
                          </div>
                          <div className='form-group mb-2'>
                            <label
                              htmlFor='exampleInputEmail2'
                              className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                            >
                              ID Supplier
                            </label>
                            <input
                              onChange={formik.handleChange}
                              value={formik.values.id_suplier}
                              disabled
                              type='text'
                              className='tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-gray-100 tw-bg-clip-padding tw-border tw-border-solid tw-border-gray-300 tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-blue-600 focus:tw-outline-none'
                              name='sup_name'
                              id='sup_name'
                              placeholder='Supplier name'
                            />
                          </div>
                          <div className='form-group mb-2'>
                            <label
                              htmlFor='exampleInputEmail2'
                              className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                            >
                              Supplier Name
                            </label>
                            <div className='tw-relative'>
                              <input
                                onChange={formik.handleChange}
                                value={formik.values.sup_name}
                                type='text'
                                className={`${formik.touched.sup_name && formik.errors.sup_name ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                name='sup_name'
                                id='sup_name'
                                placeholder='Supplier name'
                              />
                              {
                                formik.touched.sup_name && formik.errors.sup_name && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                  {formik.errors.sup_name}
                                </p>
                              }
                            </div>
                          </div>
                          {/* <div className='form-group mb-2'>
                            <label
                              htmlFor='exampleInputEmail2'
                              className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                            >
                              Address
                            </label>
                            <div className='tw-relative'>
                              <input
                                onChange={formik.handleChange}
                                value={formik.values.alamat}
                                name='alamat'
                                type='text'
                                className={`${formik.touched.alamat && formik.errors.alamat ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                id='alamat'
                                placeholder='Address'
                              />
                              {
                                formik.touched.alamat && formik.errors.alamat && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                  {formik.errors.alamat}
                                </p>
                              }
                            </div>
                          </div> */}
                          {/* <div className='form-group mb-2'>
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
                                name='kota'
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
                          </div> */}
                          <div className='form-group mb-2'>
                            <label
                              htmlFor='exampleInputEmail2'
                              className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                            >
                              Office Phone Number
                            </label>
                            <PhoneInput
                              country={'id'}
                              value={formik.values.phone}
                              onChange={phone => {
                                formik.setValues((val) => ({
                                  ...val,
                                  phone: phone
                                }))
                              }}
                            />

                            {
                              formik.touched.phone && formik.errors.phone && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                {formik.errors.phone}
                              </p>
                            }
                          </div>
                          <div className='form-group mb-2'>
                            <label
                              htmlFor='exampleInputEmail2'
                              className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                            >
                              Office Email
                            </label>
                            <div className='tw-relative'>
                              <input
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                name='email'
                                type='text'
                                className={`${formik.touched.email && formik.errors.email ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                id='email'
                                placeholder='Office email'
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
                              NPWP
                            </label>
                            <div className='tw-relative'>
                              <input
                                onChange={formik.handleChange}
                                value={formik.values.npwp}
                                name='npwp'
                                type='text'
                                className={`${formik.touched.npwp && formik.errors.npwp ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                id='npwp'
                                placeholder='NPWP'
                              />
                              {
                                formik.touched.npwp && formik.errors.npwp && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                  {formik.errors.npwp}
                                </p>
                              }
                            </div>
                          </div>
                          <div className='form-group mb-2'>
                            <label
                              htmlFor='exampleInputEmail2'
                              className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                            >
                              PPN
                            </label>
                            <div className='tw-relative'>
                              <input
                                onChange={formik.handleChange}
                                value={formik.values.ppn}
                                name='ppn'
                                type='text'
                                className={`tw-border-gray-300 tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                id='ppn'
                                placeholder='PPN'
                              />
                            </div>
                          </div>
                          <div className='form-group mb-2'>
                            <label
                              htmlFor='exampleInputEmail2'
                              className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                            >
                              PPh
                            </label>
                            <div className='tw-relative'>
                              <input
                                onChange={formik.handleChange}
                                value={formik.values.pph}
                                name="pph"
                                type='text'
                                className={`tw-border-gray-300 tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                id='pph'
                                placeholder='PPh'
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className='tw-text-[#000000] tw-text-[20px] tw-font-semibold tw-pt-[24px]'>Address</h3>
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
                                        <option key={idx} value={idx+1} >{val.prov_name}</option>
                                      )
                                  })}
                                  
                                </select>
                                {/* {
                                  formikSr.touched.status_rek && formikSr.errors.status_rek && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                    {formikSr.errors.status_rek}
                                  </p>
                                } */}
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
                                  {listOfCity.data.map((e, i) => {
                                    return (
                                      <option key={i} value={e.city_name}>{e.city_name}</option>
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
                                  id='distrik'
                                  name='kota'
                                  className={`${formik.touched.distrik && formik.errors.distrik ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                  aria-label='Default select example'
                                >
                                  <option value="" disabled>
                                    Select Districts
                                  </option>
                                  {listOfDistricts.data.map((e, i) => {
                                    return (
                                      <option key={i} value={e.city_name}>{e.dis_name}</option>
                                    )
                                  })}
                                  
                                </select>
                                {
                                  formik.touched.distrik && formik.errors.distrik && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                    {formik.errors.distrik}
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
                              {/* <input
                                onChange={formik.handleChange}
                                value={formik.values.alamat}
                                name='alamat'
                                type='text'
                                className={`${formik.touched.alamat && formik.errors.alamat ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                id='alamat'
                                placeholder='Address'
                              />
                              {
                                formik.touched.alamat && formik.errors.alamat && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                  {formik.errors.alamat}
                                </p>
                              } */}
                            </div>
                          </div>

                          <h3 className='tw-text-[#000000] tw-text-[20px] tw-font-semibold tw-pt-[24px]'>Bank Account</h3>
                      <div className='tw-flex tw-gap-6 tw-pt-[14px]'>
                      <div className='tw-form-group tw-mb-2 tw-w-1/2'>
                        <label
                          htmlFor='exampleInputEmail2'
                          className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                        >
                          Bank Name
                        </label>
                        <div className='tw-relative'>
                          <input
                            onChange={formikSr.handleChange}
                            value={formikSr.values.namabank}
                            type='text'
                            className={`${formikSr.touched.namabank && formikSr.errors.namabank ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                            id='namabank'
                            name="namabank"
                            placeholder='Bank name'
                          />
                          {
                            (formikSr.touched.namabank && formikSr.errors.namabank) &&
                            <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                              {formikSr.errors.namabank}
                            </p>
                          }
                        </div>
                      </div>
                      <div className='tw-form-group tw-mb-2 tw-w-1/2'>
                        <label
                          htmlFor='exampleInputEmail2'
                          className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                        >
                          Account Number
                        </label>
                        <div className='tw-relative'>
                          <input
                            onChange={formikSr.handleChange}
                            value={formikSr.values.koderek}
                            type='text'
                            className={`${formikSr.touched.koderek && formikSr.errors.koderek ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                            id='koderek'
                            name="koderek"
                            placeholder='Account Number'
                          />
                          {
                            (formikSr.touched.koderek && formikSr.errors.koderek) &&
                            <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                              {formikSr.errors.koderek}
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
                            Account Name
                          </label>
                          <div className='tw-relative'>
                            <input
                              onChange={formikSr.handleChange}
                              value={formikSr.values.namaakun}
                              type='text'
                              className={`${formikSr.touched.namaakun && formikSr.errors.namaakun ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                              id='namaakun'
                              name="namaakun"
                              placeholder='Account Name'
                            />
                            {
                              (formikSr.touched.namaakun && formikSr.errors.namaakun) &&
                              <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                {formikSr.errors.namaakun}
                              </p>
                            }
                          </div>
                        </div>
                        <div className='tw-form-group tw-mb-2'>
                              <label
                                htmlFor='exampleInputEmail2'
                                className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                              >
                                Account Status
                              </label>
                              <div className='tw-relative'>
                                <select
                                  onChange={formikSr.handleChange}
                                  value={formikSr.values.status_rek}
                                  id='status_rek'
                                  name='status_rek'
                                  className={`${formikSr.touched.status_rek && formikSr.errors.status_rek ? `tw-border-red-500` : `tw-border-gray-300`} tw-form-control tw-block tw-w-full tw-px-3 tw-py-2 tw-text-sm tw-font-normal  tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-rounded tw-transition tw-ease-in-out tw-m-0 focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none`}
                                  aria-label='Default select example'
                                >
                                  <option value="" disabled>
                                    Select Status
                                  </option>
                                  <option value='active'>Active</option>
                                  <option value='inactive'>Inactive</option>
                                </select>
                                {
                                  formikSr.touched.status_rek && formikSr.errors.status_rek && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                                    {formikSr.errors.status_rek}
                                  </p>
                                }
                              </div>
                            </div>
                        
                      </div>
                      <div className="tw-relative">
                        <button
                          onClick={formikSr.handleSubmit}
                          type='button'
                          className='tw-text-[#66B6FF] tw-text-sm tw-font-medium'
                        >
                          + Add new Bank Account 
                        </button>
                      </div>
                      {
                        formik.values.suprek.length > 0 &&
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
                                  Bank Name
                                </th>
                                <th
                                  scope='tw-col'
                                  className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                                >
                                  Account Number
                                </th>
                                <th
                                  scope='tw-col'
                                  className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                                >
                                  Account Name
                                </th>
                                <th
                                  scope='tw-col'
                                  className='tw-text-sm tw-font-medium tw-text-gray-900 tw-px-6 tw-py-2 tw-text-left'
                                >
                                  Account Status
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
                                formik.values.suprek.map((i, idx) => {
                                  return (
                                    <tr
                                      key={idx}
                                      className='tw-border-b hover:tw-bg-sky-100'
                                    >
                                      <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-12'>
                                        {idx + 1}
                                      </td>
                                      <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                        {i.namabank}
                                      </td>
                                      <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                        {i.koderek}
                                      </td>
                                      <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                        {i.namaakun}
                                      </td>
                                      <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap tw-w-1/3'>
                                        {i.status_rek}
                                      </td>
                                      <td className='tw-text-sm tw-text-gray-900 tw-font-light tw-px-6 tw-py-2 tw-whitespace-wrap'>
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault()
                                            removeSupplierBank(idx)
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

                  <TabPanel value={value} index={1}>
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

                    <div className='form-group mb-2'>
                        <label
                          htmlFor='exampleInputEmail2'
                          className='tw-form-label tw-text-sm tw-font-bold tw-inline-block tw-mb-2 tw-text-gray-700'
                        >
                          Phone Number
                        </label>
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
                          formik.touched.contact_person_telp && formik.errors.contact_person_telp && <p className='tw-absolute tw-text-red-500 -tw-top-4 tw-right-0 tw-m-0 tw-text-xs'>
                            {formik.errors.contact_person_telp}
                          </p>
                        }
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
                  </TabPanel>
                </form>
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
