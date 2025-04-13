import mongoose from "mongoose";
import Supervisor from "../models/supervisor.model.js";

export const createSupervisor = async (req, res) => {
  try {
    const { Email, Password, Username } = req.body;

    // Validate required fields
    if (!Email || !Password || !Username) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        details: {
          Email: !Email ? 'Email is required' : undefined,
          Password: !Password ? 'Password is required' : undefined,
          Username: !Username ? 'Username is required' : undefined
        }
      });
    }

    // Check if email already exists
    const existingSupervisor = await Supervisor.findOne({ Email: Email.toLowerCase() });
    if (existingSupervisor) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
        details: 'An account with this email already exists'
      });
    }

    const newSupervisor = new Supervisor({
      Username: Username.trim(),
      Email: Email.toLowerCase().trim(),
      Password: Password
    });

    // Validate the supervisor document before saving
    const validationError = newSupervisor.validateSync();
    if (validationError) {
      console.error('Validation error:', validationError);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(validationError.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    await newSupervisor.save();
    res.status(201).json({
      success: true,
      data: newSupervisor,
    });
  } catch (error) {
    console.error('Create supervisor error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSupervisors = async (req, res) => {
  try {
    const supervisors = await Supervisor.find({});
    res.status(200).json({
      success: true,
      data: supervisors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getSupervisorById = async (req, res) => {
  try {
    const supervisor = await Supervisor.findById(req.params.id);
    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }
    res.status(200).json({
      success: true,
      data: supervisor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateSupervisor = async (req, res) => {
  try {
    const updatedSupervisor = await Supervisor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSupervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedSupervisor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteSupervisor = async (req, res) => {
  try {
    const deletedSupervisor = await Supervisor.findByIdAndDelete(req.params.id);
    if (!deletedSupervisor) {
      return res.status(404).json({
        success: false,
        message: "Supervisor not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Supervisor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
