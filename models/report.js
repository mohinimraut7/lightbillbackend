
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  monthReport: { type: String },
  seleMonth: { type: String },
  ward: { type: String },
    reportingRemarks: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
          role: { type: String }, 
          remark: { type: String }, 
        
          signature: { type: String },
          date: { type: Date, default: Date.now }, 
          documents: [
            {
                formType: { type: String},
                formNumber: { type: String}, 
                pdfFile: { type: String }, 
                uploadedAt: { type: Date, default: Date.now },
                // seleMonth:{ type: String },
            }
        ]
          
          // seleMonth:{ type: String },
        }
      ],
      
     
}, { timestamps: true }); 

module.exports = mongoose.model('Report', reportSchema);
