import React, { useState, memo, useLayoutEffect, useEffect } from 'react'
// import BootstrapTable from 'react-bootstrap-table-next'
import {
    textFilter,
    selectFilter
    // customFilter,
    // FILTER_TYPES
} from 'react-bootstrap-table2-filter'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'
import AksiFormatter from '../components/employe/AksiFormatter'
import PageButtonRenderer from '../components/tabel/PageButtonRenderer'
import SizePerPageRenderer from '../components/tabel/SizePerPageRenderer'
// import MyDatePicker from '../components/data_picker/MyDatePicker'
import ModalTambah from '../components/employe/ModalTambah'
import ModalEdit from '../components/employe/ModalEdit'
import ModalDetail from '../components/employe/ModalDetail'
import ModalRemove from '../components/employe/ModalRemove'
import MyTable from '../components/tabel/MyTable'
import { useDispatch, useSelector } from 'react-redux'
import { getEmployees, setSuccess } from '../store/slices/employeeSlice'
import { getProvince, getDataCity, getDataDistrict, getSubDis, getDepart } from '../store/slices/generalSlice'
import moment from 'moment'
const classNameFilterForm =
    'tw-form-control tw-flex tw-py-1 tw-px-2 tw-text-xs tw-font-normal tw-text-gray-700 tw-bg-white tw-bg-clip-padding tw-border tw-border-solid tw-border-gray-300 tw-rounded tw-transition tw-ease-in-out tw-m-0  focus:tw-text-gray-700 focus:tw-bg-white focus:tw-border-sky-600 focus:tw-outline-none'

const Employe = () => {
    const [token, setToken] = useState(sessionStorage.getItem('token'))
    const dispatch = useDispatch()
    const { data, limit, totalData, currentPage, isLoading } = useSelector(
        state => state.employeeSlice.dataEmployee
    )
    const listOfDistricts = useSelector(state => state.supplierSlice.dataDistrict)
    const listOfCity = useSelector(state => state.supplierSlice.dataCity)
    const listProvince = useSelector(state => state.supplierSlice.dataProvince)
    const listOfSubDist = useSelector(state => state.supplierSlice.dataSubDistrict)
    const depart = useSelector(state => state.generalSlice.dataDepart)

    const [isHiden, setIsHiden] = useState({
        departement_id: false,
        email: true,
        phone: true,
        tmptlahir: true,
        tgllahir: true,
        id_card: true,
        karyawan_status: true,
        jenis_kelamin: true,
        status: true,
        alamat: true,
        kota: true,
        starjoin: true,
        sisa_cuti: true,
    })

    const [valAksi, setValAksi] = useState({
        id: "",
        nik: "",
        nickname: "",
        nama_karyawan: "",
        departement_id: "",
        email: "",
        alamat: "",
        kota: "",
        provinsi: "",
        kecamatan: "",
        kelurahan: "",
        kodepos: "",
        phone: "",
        tmptlahir: "",
        tgllahir: "",
        id_card: "",
        karyawan_status: "",
        jenis_kelamin: "",
        status: "",
        starjoin: "",
        sisa_cuti: "",
        spouse_name: "",
        jenis_kelamin_spouse: "",
        tmpt_lahir_spouse: "",
        tgllahir_spouse: "",
        emppen: [],
        emppel: [],
        empchild: []
    })

    const defaultToggleColumn = (toggleVal, columnField) => {
        setIsHiden(isHiden => ({
            ...isHiden,
            [columnField]: !toggleVal
        }))
    }

    const conditionHidden = column => {
        return (
            column.text !== '#' &&
            column.text !== 'nik' &&
            column.text !== 'Employee Name' &&
            column.text !== 'Aksi'
        )
    }

    const showModalHandler = (type, row = null) => {
        let elModal = null
        if (row !== null) {
            setValAksi(valAksi => ({
                ...valAksi,
                id: row.id,
                nik: row.nik,
                nickname: row.nickname,
                nama_karyawan: row.nama_karyawan,
                departement_id: row.departement_id,
                email: row.email,
                alamat: row.alamat,
                kota: row.kota,
                provinsi: row.provinsi,
                kecamatan: row.kecamatan,
                kelurahan: row.kelurahan,
                kodepos: row.kodepos,
                phone: row.phone,
                tmptlahir: row.tmptlahir,
                tgllahir: row.tgllahir,
                id_card: row.id_card,
                karyawan_status: row.karyawan_status,
                jenis_kelamin: row.jenis_kelamin,
                status: row.status,
                starjoin: row.starjoin,
                sisa_cuti: row.sisa_cuti,
                spouse_name: row.spouse_name,
                jenis_kelamin_spouse: row.jenis_kelamin_spouse,
                tmpt_lahir_spouse: row.tmpt_lahir_spouse,
                tgllahir_spouse: row.tgllahir_spouse,
                emppen: row.emppen,
                emppel: row.emppel,
                empchild: row.empchild
            }))
        }

        switch (type) {
            case 'tambah':
                elModal = document.querySelector(`#${type}`)
                break
            case 'detail':
                elModal = document.querySelector(`#${type}`)
                break
            case 'edit':
                elModal = document.querySelector(`#${type}`)
                break
            case 'remove':
                elModal = document.querySelector(`#${type}`)
                break

            default:
                break
        }
        if (elModal !== null) {
            dispatch(setSuccess(false))
            const modal = window.Modal.getOrCreateInstance(elModal)
            modal.show()
        }
    }

    const columns = [
        {
            dataField: 'no',
            text: '#',
            headerStyle: () => ({ width: '50px' }),
            formatter: (cell, row, rowIndex, formatExtraData) => {
                const current = currentPage
                const rowNumber = (currentPage - 1) * 10 + (rowIndex + 1)
                return rowNumber
            }
        },
        {
            dataField: 'nik',
            text: 'NIK',
            headerStyle: () => ({ width: '180px' })
        },
        {
            hidden: isHiden.nickname,
            dataField: 'nickname',
            text: 'Nickname',
            headerStyle: () => ({ width: '180px' })
        },
        {
            dataField: 'nama_karyawan',
            text: 'Employee Name',
            headerStyle: () => ({ width: '180px' })
        },
        {
            hidden: isHiden.departement_id,
            dataField: 'departement_id',
            text: 'Department',
            headerStyle: () => ({ width: '180px' })
        },
        {
            hidden: isHiden.email,
            dataField: 'email',
            text: 'Email',
            headerStyle: () => ({ width: '180px' })
        },
        {
            hidden: isHiden.tmptlahir,
            dataField: 'tmptlahir',
            text: 'Birth Place',
            headerStyle: () => ({ width: '180px' })
        },
        {
            hidden: isHiden.tgllahir,
            dataField: 'tgllahir',
            text: 'Birth Date',
            headerStyle: () => ({ width: '180px' })
        },
        {
            hidden: isHiden.id_card,
            dataField: 'id_card',
            text: 'ID Card',
            headerStyle: () => ({ width: '180px' })
        },
        {
            hidden: isHiden.karyawan_status,
            dataField: 'karyawan_status',
            text: 'Employee Status',
            headerStyle: () => ({ width: '180px' })
        },
        {
            hidden: isHiden.jenis_kelamin,
            dataField: 'jenis_kelamin',
            text: 'Gender',
            headerStyle: () => ({ width: '180px' })
        },
        {
            hidden: isHiden.status,
            dataField: 'status',
            text: 'Maritial Status',
            headerStyle: () => ({ width: '180px' })
        },
        {
            hidden: isHiden.kota,
            dataField: 'kota',
            text: 'City',
            headerStyle: () => ({ width: '180px' })
        },
        {
            hidden: isHiden.starjoin,
            dataField: 'starjoin',
            text: 'Start Joining',
            headerStyle: () => ({ width: '180px' })
        },
        {
            dataField: 'aksi',
            text: 'Aksi',
            headerStyle: () => ({ width: '100px' }),
            formatter: (cell, row) => {
                return <AksiFormatter row={row} showModalHandler={showModalHandler} />
            }
        }
    ]

    // const expandRow = {
    //     onlyOneExpanding: true,
    //     className: 'tw-bg-gray-200',
    //     renderer: row => {
    //         return (
    //             <BootstrapTable
    //                 keyField='id'
    //                 classes='m-0'
    //                 data={[
    //                     {
    //                         nama: 'andri',
    //                         telp: '080087996'
    //                     }
    //                 ]}
    //                 columns={[
    //                     {
    //                         dataField: 'nama',
    //                         text: 'Nama'
    //                     },
    //                     {
    //                         dataField: 'telp',
    //                         text: 'Telephone'
    //                     }
    //                 ]}
    //             />
    //         )
    //     },
    //     showExpandColumn: false
    // }

    const onPageChange = page => {
        dispatch(getEmployees({ page: page, perPage: '10', token: token }))
    }

    const options = {
        custom: true,
        sizePerPage: limit,
        page: currentPage,
        totalSize: totalData,
        pageButtonRenderer: pageProps => {
            return (
                <PageButtonRenderer
                    key={pageProps.page}
                    pageProps={pageProps}
                    onPageChange={onPageChange}
                />
            )
        },
        sizePerPageRenderer: SizePerPageRenderer
    }

    useLayoutEffect(() => {
        dispatch(getEmployees({ token: token }))
    }, [])

    useEffect(() => {
        return () => {
            dispatch(setSuccess(false))
        }
    }, [])

    useLayoutEffect(() => {
        dispatch(getProvince({ token: token }))
    }, [])

    const getCity = (id) => {
        dispatch(getDataCity({id : id, token: token }))
    }

    const getDistricts = (id) => {
        dispatch(getDataDistrict({id : id, token : token}))
    }

    const getSubDistrict = (id) => {
        dispatch(getSubDis({id : id, token: token }))
    }

    useLayoutEffect(() => {
        dispatch(getDepart({ token: token }))
    }, [])

    return (
        <>
            <div className='tw-bg-white tw-p-3 tw-rounded-lg'>
                <MyTable
                    btnProps={'Employee'}
                    data={data}
                    columns={columns}
                    options={options}
                    defaultToggleColumn={defaultToggleColumn}
                    showModalHandler={showModalHandler}
                    conditionHidden={conditionHidden}
                    expandRow={{}}
                    loading={isLoading}
                    remote={true}
                />
            </div>
            <ModalTambah
                listOfDistricts={listOfDistricts} 
                getDistricts={getDistricts} 
                getCity={getCity} 
                listOfCity={listOfCity} 
                listProvince={listProvince} 
                listOfSubDist={listOfSubDist}
                getSubDistrict={getSubDistrict}
                token={token}
                depart={depart}
            />
            <ModalEdit depart={depart} valAksi={valAksi} token={token} />
            <ModalDetail valAksi={valAksi} token={token} />
            <ModalRemove valId={valAksi.id} token={token} />
        </>
    )
}

export default memo(Employe)
