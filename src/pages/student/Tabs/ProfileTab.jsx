import React, { useState, useRef } from 'react';
import { User, FileText, Briefcase, Award, UploadCloud, Link as LinkIcon, Linkedin, Github, Upload, CheckCircle, ShieldAlert } from 'lucide-react';
import api from '../../../utils/api';

export default function ProfileTab({ student, refreshData }) {
  const [formData, setFormData] = useState({
    skills: student.skills || '',
    certifications: student.certifications || '',
    experience: student.experience || '',
    roll_no: student.roll_no || '',
    enrollment_no: student.enrollment_no || '',
    department: student.department || '',
    course: student.course || '',
    batch: student.batch || '',
    linkedin_url: student.linkedin_url || '',
    github_url: student.github_url || '',
  });
  const [isEditing, setIsEditing] = useState(!student.roll_no);
  const [resumeFile, setResumeFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setErrorMsg('Only PDF files are allowed for resumes.');
        setResumeFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('File size must be less than 5MB.');
        setResumeFile(null);
        return;
      }
      setResumeFile(file);
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    // Validation
    const rollNoRegex = /^DS[a-zA-Z0-9]A-[a-zA-Z0-9]{4}$/i;
    if (formData.roll_no && !rollNoRegex.test(formData.roll_no)) {
      setErrorMsg('Roll Number must follow the format: DSXA-XXXX');
      setSaving(false);
      return;
    }

    const enrollRegex = /^DE[a-zA-Z0-9]{7}$/i;
    if (formData.enrollment_no && !enrollRegex.test(formData.enrollment_no)) {
      setErrorMsg('Enrollment Number must follow the format: DEXXXXXXX');
      setSaving(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('skills', formData.skills);
      data.append('certifications', formData.certifications);
      data.append('experience', formData.experience);
      data.append('roll_no', formData.roll_no);
      data.append('enrollment_no', formData.enrollment_no);
      data.append('department', formData.department);
      data.append('course', formData.course);
      data.append('batch', formData.batch);
      data.append('linkedin_url', formData.linkedin_url);
      data.append('github_url', formData.github_url);
      
      if (resumeFile) {
        data.append('resume', resumeFile);
      }

      const response = await api.post('/student/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccessMsg(response.data.message);
      setResumeFile(null); // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
      refreshData(); // Fetch the latest data globally
      setIsEditing(false); // Lock form after save
      
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex border-b border-slate-200 pb-4 items-center justify-between">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 flex items-center gap-2">
          <User className="text-emerald-500" /> My Profile
        </h2>
      </div>

      {successMsg && <div className="p-4 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl font-medium">{successMsg}</div>}
      {errorMsg && <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium">{errorMsg}</div>}

      {(!student.roll_no || !student.course || !student.batch) && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
          <div className="flex">
            <div className="flex-shrink-0">
              <User className="h-5 w-5 text-amber-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Compulsory Academic Details Missing</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>Please fill out your compulsory academic information (Roll No, Course, Batch, etc.) to apply for placement drives. Recruiters require this data.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset disabled={!isEditing} className="space-y-6 group">
          {/* Compulsory Academic Section */}
          <div className="glass-panel p-6 border-l-4 border-l-rose-500">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <User className="text-rose-500" size={20} /> Academic Details (Compulsory)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Roll Number *</label>
              <input type="text" name="roll_no" value={formData.roll_no} onChange={handleChange} required className="input-field" placeholder="e.g. DSXA-XXXX" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Enrollment Number</label>
              <input type="text" name="enrollment_no" value={formData.enrollment_no} onChange={handleChange} className="input-field" placeholder="e.g. DEXXXXXXX" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} className="input-field" placeholder="e.g. Computer Science" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Course Type *</label>
              <select name="course" value={formData.course} onChange={handleChange} required className="input-field">
                <option value="">Select Course</option>
                <option value="M.Tech. Dual Degree AI & DS">M.Tech. Dual Degree AI & DS</option>
                <option value="MBA (Business Analytics)">MBA (Business Analytics)</option>
                <option value="BDA">BDA</option>
                <option value="M.Tech. DS">M.Tech. DS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Graduating Batch Year *</label>
              <input type="number" name="batch" value={formData.batch} onChange={handleChange} required className="input-field" placeholder="e.g. 2026" min="2020" max="2030" />
            </div>
          </div>
        </div>

        {/* Resume Section */}
        <div className="glass-panel p-6 border-l-4 border-l-blue-500">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileText className="text-blue-500" size={20} /> Latest Resume
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            {student.resume_url ? (
              <div className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-700">Uploaded Resume</p>
                  <p className="text-xs text-slate-500">Currently active for new applications</p>
                </div>
                <a 
                  href={`http://localhost:5000${student.resume_url}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-bold"
                >
                  <LinkIcon size={14} /> View
                </a>
              </div>
            ) : (
              <div className="flex-1 bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-700 text-sm font-medium">
                No resume uploaded yet. Ensure you upload one to maximize placement chances.
              </div>
            )}
            
            <div className="flex-1 w-full">
              <label className="block border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-colors">
                <UploadCloud className="mx-auto text-slate-400 mb-2" size={24} />
                <span className="text-sm font-semibold text-blue-600 block">
                  {resumeFile ? resumeFile.name : 'Upload New Resume (PDF)'}
                </span>
                <span className="text-xs text-slate-500 block mt-1">Max size 5MB</span>
                <input 
                  type="file" 
                  accept="application/pdf" 
                  className="hidden" 
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="glass-panel p-6 border-l-4 border-l-teal-500">
          <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Award className="text-teal-500" size={20} /> Professional Skills
          </h3>
          <p className="text-sm text-slate-500 mb-4">List your technical and soft skills (comma separated).</p>
          <textarea
            className="input-field"
            rows="2"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., Python, React, Data Structures, Leadership"
          ></textarea>
        </div>

        {/* Experience Section */}
        <div className="glass-panel p-6 border-l-4 border-l-amber-500">
          <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Briefcase className="text-amber-500" size={20} /> Work Experience / Internships
          </h3>
          <p className="text-sm text-slate-500 mb-4">Mention your past roles, companies, and key achievements.</p>
          <textarea
            className="input-field"
            rows="3"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="e.g., Software Engineering Intern at TechCorp (May 2025 - Jul 2025)..."
          ></textarea>
        </div>

        {/* Certifications Section */}
        <div className="glass-panel p-6 border-l-4 border-l-purple-500">
          <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
            <User className="text-purple-500" size={20} /> Certifications
          </h3>
          <p className="text-sm text-slate-500 mb-4">List your notable certifications to stand out to recruiters.</p>
          <textarea
            className="input-field"
            rows="3"
            name="certifications"
            value={formData.certifications}
            onChange={handleChange}
            placeholder="e.g., AWS Certified Cloud Practitioner, Meta Frontend Developer..."
          ></textarea>
        </div>

        {/* Social Links Section */}
        <div className="glass-panel p-6 border-l-4 border-l-indigo-500">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <LinkIcon className="text-indigo-500" size={20} /> Social Portfolios
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1.5"><Linkedin size={16} className="text-blue-600"/> LinkedIn Profile URL</label>
              <input type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} className="input-field" placeholder="https://linkedin.com/in/username" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1.5"><Github size={16} className="text-slate-800"/> GitHub Profile URL</label>
              <input type="url" name="github_url" value={formData.github_url} onChange={handleChange} className="input-field" placeholder="https://github.com/username" />
            </div>
          </div>
        </div>
        </fieldset>

        <div className="flex justify-end pt-4 pb-8 items-center gap-4">
          {!isEditing ? (
            <>
              <span className="text-emerald-600 font-bold flex items-center gap-1.5"><CheckCircle size={18}/> Details Saved</span>
              <button 
                type="button" 
                onClick={() => setIsEditing(true)} 
                className="px-6 py-2.5 rounded-xl border-2 border-slate-200 font-bold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                Edit Details
              </button>
            </>
          ) : (
            <button 
              type="submit" 
              disabled={saving}
              className="btn-primary min-w-[150px] shadow-emerald-500/20"
            >
              {saving ? 'Saving...' : 'Save Profile Details'}
            </button>
          )}
        </div>
      </form>

      {/* Danger Zone */}
      <div className="mt-12 glass-panel p-6 border-l-4 border-l-red-500 bg-red-50/30">
        <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
          <ShieldAlert className="text-red-500" size={20} /> Danger Zone
        </h3>
        <p className="text-sm text-slate-600 mb-4">Deleting your account is permanent. All your data, applications, and query history will be wiped from the placement cell systems. This action cannot be undone.</p>
        <button 
          type="button" 
          onClick={async () => {
            if (window.confirm("Are you absolutely sure you want to PERMANENTLY delete your account? This action cannot be undone and you will lose all application history.")) {
              try {
                await api.delete('/student/profile');
                alert("Account deleted successfully.");
                localStorage.removeItem('token');
                localStorage.removeItem('userType');
                window.location.href = '/login';
              } catch (err) {
                alert("Failed to delete account. Please try again.");
              }
            }
          }}
          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-lg border border-red-200 transition-colors"
        >
          Delete My Account
        </button>
      </div>
    </div>
  );
}
