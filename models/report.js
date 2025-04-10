
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  monthReport: { type: String },
  seleMonth: { type: String },
    reportingRemarks: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
          role: { type: String }, 
          remark: { type: String }, 
          ward: { type: String },
          signature: { type: String },
          date: { type: Date, default: Date.now }, 
          
          // seleMonth:{ type: String },
        }
      ],
      documents: [
        {
            formType: { type: String},
            formNumber: { type: String}, 
            pdfFile: { type: String }, 
            uploadedAt: { type: Date, default: Date.now },
            seleMonth:{ type: String },
        }
    ]
}, { timestamps: true }); 

module.exports = mongoose.model('Report', reportSchema);
