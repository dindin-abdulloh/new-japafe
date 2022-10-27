import React, { useState, memo, useEffect, useLayoutEffect, useMemo } from 'react'
import BootstrapTable from 'react-bootstrap-table-next/dist/react-bootstrap-table-next'
import {
    textFilter,
    // selectFilter,
    // customFilter,
    // FILTER_TYPES
} from 'react-bootstrap-table2-filter'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'
import AksiFormatter from '../components/customer/AksiFormatter'
import PageButtonRenderer from '../components/tabel/PageButtonRenderer'
import SizePerPageRenderer from '../components/tabel/SizePerPageRenderer'
import ModalTambah from '../components/customer/ModalTambah'
import ModalEdit from '../components/customer/ModalEdit'
import ModalDetail from '../components/customer/ModalDetail'
import ModalRemove from '../components/customer/ModalRemove'
import MyTable from '../components/tabel/MyTable'
import { useDispatch, useSelector } from 'react-redux'
import { getCustomer, setSuccess } from '../store/slices/customerSlice'
import { useOutletContext } from "react-router-dom";
import moment from "moment"
import { getProvince, getDataCity, getDataDistrict, getSubDis } from '../store/slices/generalSlice'




const Customer = () => {
    const [val, setVal] = useState({
        createID: ''
    })

    const [token, setToken] = useState(sessionStorage.getItem('token'));
    const dispatch = useDispatch()
    const { data, limit, totalData, currentPage, isLoading } = useSelector(state => state.customerSlice.dataCustomer)
    const listOfDistricts = useSelector(state => state.supplierSlice.dataDistrict)
    const listOfCity = useSelector(state => state.supplierSlice.dataCity)
    const listProvince = useSelector(state => state.supplierSlice.dataProvince)
    const listOfSubDist = useSelector(state => state.supplierSlice.dataSubDistrict)


    // const initData = data.map((e) => {
    //     return {
    //         id_customer: e.id_customer,
    //         nama: e.nama,
    //         alamat : e.addrescus.map((val) => {
    //             return val.alamat
    //         }),
    //         kota: e.addrescus.map((val) => {
    //             return val.kota
    //         }),
    //         email: e.email,
    //         phone: e.cuskontak.map((val) => {
    //             return val.contact_person_telp
    //         }),
    //         contact_person : e.contact_person,
    //     }
    // })

    const [isHiden, setIsHiden] = useState({
        alamat: false,
        kota: true,
        email: true,
        phone: false,
        alamat_workshop: true,
        alamat_penerima: true,
    })

    const [valAksi, setValAksi] = useState({
        id: '',
        id_customer: '',
        nama: '',
        alamat: '',
        addrescus : [],
        kota: '',
        email: '',
        phone: '',
        alamat_workshop: '',
        alamat_penerima: '',
        cuskontak : []
    })

    const defaultToggleColumn = (toggleVal, columnField) => {
        setIsHiden(isHiden => ({
            ...isHiden,
            [columnField]: !toggleVal
        }))
    }

    const conditionHidden = (column) => {
        return (
            column.text !== '#' &&
            column.text !== 'ID Customer' &&
            column.text !== 'Name Customer' &&
            column.text !== 'Aksi'
        )
    }

    const showModalHandler = (type, row = null) => {
        let elModal = null
        if (row !== null) {
            setValAksi(valAksi => ({
                ...valAksi,
                id: row.id,
                id_customer: row.id_customer,
                nama: row.nama,
                alamat: row.alamat,
                kota: row.kota,
                email: row.email,
                addrescus : row.addrescus,
                cuskontak : row.cuskontak,
                phone: row.phone,
                alamat_workshop: row.alamat_workshop,
                alamat_penerima: row.alamat_penerima,
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
            const nowDate = new Date()
            setVal((val) => ({
                ...val,
                createID: `C${moment(nowDate).format('MDDYYYYHHmmss')}`
            }))
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
                const rowNumber = (current - 1) * 10 + (rowIndex + 1)
                return rowNumber
            }
        },
        {
            dataField: 'id_customer',
            text: 'ID Customer',
            headerStyle: () => ({ width: '180px' })
        },
        {
            dataField: 'nama',
            text: 'Name Customer',
            headerStyle: () => ({ width: '180px' })
        },
        {
            hidden: isHiden.alamat,
            dataField: 'alamat',
            text: 'Address',
            headerStyle: () => ({ width: '250px' })
        },
        {
            hidden: isHiden.kota,
            dataField: 'kota',
            text: 'City',
            headerStyle: () => ({ width: '180px' })
        },
        {
            hidden: isHiden.email,
            dataField: 'email',
            text: 'Email',
            headerStyle: () => ({ width: '180px' })
        },
        {
            hidden: isHiden.phone,
            dataField: 'phone',
            text: 'Office Phone',
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

    const expandRow = {
        onlyOneExpanding: true,
        className: 'tw-bg-gray-200',
        renderer: row => {
            return (
                <BootstrapTable
                    keyField='id'
                    classes='m-0'
                    data={[
                        {
                            nama: 'andri',
                            telp: '080087996'
                        }
                    ]}
                    columns={[
                        {
                            dataField: 'nama',
                            text: 'Nama'
                        },
                        {
                            dataField: 'telp',
                            text: 'Telephone'
                        }
                    ]}
                />
            )
        },
        showExpandColumn: false
    }

    const onPageChange = (page) => {
        dispatch(getCustomer({ page: page, perPage: '10', token: token }))
    }

    const options = {
        custom: true,
        sizePerPage: limit,
        page: currentPage,
        totalSize: totalData,
        pageButtonRenderer: (pageProps) => {
            return <PageButtonRenderer key={pageProps.page} pageProps={pageProps} onPageChange={onPageChange} />
        },
        sizePerPageRenderer: SizePerPageRenderer
    }

    const searchHandler = (e) => {
        dispatch(getCustomer({ token: token, search: e.target.value }))
    }

    useLayoutEffect(() => {
        dispatch(getCustomer({ token: token }))
    }, [])

    useEffect(() => {
        console.log(totalData);
    }, [data])

    useEffect(() => {
        return () => {
            dispatch(setSuccess(false))
        }
    }, [])

    useLayoutEffect(() => {
        dispatch(getProvince({ token: token }))
    }, [])

    const getDistricts = (id) => {
        dispatch(getDataDistrict({id : id, token : token}))
    }

    const getCity = (id) => {
        dispatch(getDataCity({id : id, token: token }))
    }

    const getSubDistrict = (id) => {
        dispatch(getSubDis({id : id, token: token }))
    }

    return (
        <>
            <div className='tw-bg-white tw-p-3 tw-rounded-lg'>
                <MyTable
                    data={data}
                    columns={columns}
                    options={options}
                    defaultToggleColumn={defaultToggleColumn}
                    showModalHandler={showModalHandler}
                    conditionHidden={conditionHidden}
                    expandRow={{}}
                    loading={isLoading}
                    remote={true}
                    searchHandler={searchHandler}
                    btnProps={"Customer"}
                />
            </div>
            <ModalTambah 
                val={val} 
                token={token} 
                listOfDistricts={listOfDistricts} 
                getDistricts={getDistricts} 
                getCity={getCity} 
                listOfCity={listOfCity} 
                listProvince={listProvince} 
                listOfSubDist={listOfSubDist}
                getSubDistrict={getSubDistrict}
            />
            <ModalEdit 
                listOfDistricts={listOfDistricts} 
                getDistricts={getDistricts} 
                getCity={getCity} 
                listOfCity={listOfCity} 
                listProvince={listProvince} 
                listOfSubDist={listOfSubDist}
                getSubDistrict={getSubDistrict} 
                valAksi={valAksi} 
                token={token} 
            />
            <ModalDetail valAksi={valAksi} token={token} />
            <ModalRemove valId={valAksi.id} token={token} />
        </>
    )
}

export default memo(Customer)
