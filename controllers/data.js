/**
 * Create Data [first time only]
 * Get Data
 * Update Data
 */

const Data = require("../models/Data")
const resErr = require("../utils/resErr")
const path = require('path')
const {unlink} = require('fs')

// create data
exports.createData = async (req, res) => {
    try {
        const newData = new Data({
            heroTitle: 'I\'m John Doe',
            heroDesc: 'Lorem ipsum, dolor sit mate constitute adipescent elite. Harem labored, superiors provident volutes doldrum',
            heroImg: 'default.png',
            logo: '',
            aboutDesc: 'Lorem ipsum, dolor sit mate constitute adipescent elite. Harem labored, superiors provident volutes doldrum Lorem ipsum, dolor sit mate constitute',
            aboutImg: 'default.png',
            resume: 'resume.pdf',
            chatLink: 'http://github.com/md-kibria'
        })

        const newCreatedData = await newData.save()

        res.status(201).json({
            status: 201,
            msg: 'Data created successfully',
            data: newCreatedData
        })

    } catch (error) {
        resErr(res, error)
    }
}

// get data
exports.getData = async (req, res) => {
    try {
        const data = await Data.find()

        if(data.length !== 0) {
            res.status(200).json({
                status: 200,
                msg: 'All data',
                data: data[0]
            })
        }

    } catch (error) {
        resErr(res, error)
    }
}

// update data
exports.updateData = async (req, res) => {
    const {id} = req.params
    const {heroTitle, heroDesc, aboutDesc, chatLink} = req.body
    let heroImg = req.files.heroImg && req.files.heroImg[0].filename
    let aboutImg = req.files.aboutImg && req.files.aboutImg[0].filename
    let resume = req.files.resume && req.files.resume[0].filename

    try {
        const data = await Data.findById(id)

        if(!data) {
            res.status(404).josn({
                status: 404,
                msg: 'Data not found for update'
            })
        } else {
            
            // delete previous files
            if(heroImg && data.heroImg !== 'default.png') {
                unlink(path.join(__dirname, `/../public/uploads/${data.heroImg}`), err => {
                    if(err) console.log(err)
                })
            }

            if(aboutImg && data.aboutImg !== 'default.png') {
                unlink(path.join(__dirname, `/../public/uploads/${data.aboutImg}`), err => {
                    if(err) console.log(err)
                })
            }

            if(resume && data.resume !== 'resume.pdf') {
                unlink(path.join(__dirname, `/../public/uploads/${data.resume}`), err => {
                    if(err) console.log(err)
                })
            }

            const updatedData = {
                heroTitle: heroTitle || data.heroTitle,
                heroDesc: heroDesc || data.heroDesc,
                aboutDesc: aboutDesc || data.aboutDesc,
                chatLink: chatLink || data.chatLink,
                heroImg: heroImg || data.heroImg,
                aboutImg: aboutImg || data.aboutImg,
                resume: resume || data.resume
            }

            const newUpdatedData = await Data.findByIdAndUpdate(id, {$set: updatedData}, {new: true, useFindAndModify: false})

            res.status(200).json({
                status: 200,
                msg: 'Data updated successfully',
                data: newUpdatedData
            })

        }

    } catch (error) {
        resErr(res, error)
    }

}