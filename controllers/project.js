/**
 * Create Project
 * Get All Project
 * Get Single Project
 * Update Project
 * Delete Project
 */

const Project = require('../models/Project')
const resErr = require('../utils/resErr')
const path = require('path')
const { unlink } = require('fs')

// create project
exports.createProject = async (req, res) => {
    const { title, desc, link } = req.body
    const thumbnail = req.file.filename
    const newProject = new Project({
        title,
        desc,
        thumbnail,
        link
    })

    try {
        const project = await newProject.save()

        res.status(201).json({
            status: 201,
            msg: 'Project created successfully',
            project
        })

    } catch (error) {
        resErr(res, error)
    }
}

// get all project
exports.getAllProject = async (req, res) => {
    try {
        const projects = await Project.find().select({ __v: 0 })

        res.status(200).json({
            status: 200,
            msg: 'All projects',
            total: projects.length,
            projects
        })

    } catch (error) {
        resErr(res, error)
    }
}

// get single project
exports.getSingleProject = async (req, res) => {
    const { id } = req.params
    try {
        const project = await Project.findById(id).select({ __v: 0 })

        if (!project) {
            res.status(404).json({
                status: 404,
                msg: 'Project not found'
            })
        }

        res.status(200).json({
            status: 200,
            msg: 'Single project',
            project
        })

    } catch (error) {
        resErr(res, error)
    }
}

// update project
exports.updateProject = async (req, res) => {
    const { id } = req.params
    const { title, desc, link } = req.body

    try {
        const project = await Project.findById(id)

        if (!project) {
            res.status(404).json({
                status: 404,
                msg: 'Project is not found for update',
            })
        }

        const updatedProject = {
            title: title || project.title,
            desc: desc || project.desc,
            link: link || project.link,
            thumbnail: req.file ? req.file.filename : project.thumbnail
        }

        // delete old thumbnail
        if (req.file) {
            unlink(path.join(__dirname, `/../public/uploads/${project.thumbnail}`), err => {
                if (err) {
                    console.log(err)
                }
            })
        }

        const newUpdatedProject = await Project.findByIdAndUpdate(id, { $set: updatedProject }, { new: true, useFindAndModify: false })

        res.status(200).json({
            status: 200,
            msg: 'Project updated successfylly',
            project: newUpdatedProject
        })

    } catch (error) {
        resErr(res, error)
    }

}

// delete project
exports.deleteProject = async (req, res) => {
    const { id } = req.params
    try {
        const project = await Project.findByIdAndDelete(id)

        if (!project) {
            res.status(404).json({
                status: 404,
                msg: 'Project not found for delete'
            })
        } else {
            // delete thumbnail from server
            if (project.thumbnail) {
                unlink(path.join(__dirname, `/../public/uploads/${project.thumbnail}`), err => {
                    if (err) {
                        console.log(err)
                    }
                })
            }

            res.status(200).json({
                status: 200,
                msg: 'Project deleted successfylly',
                project
            })
        }

    } catch (error) {
        resErr(res, error)
    }
}