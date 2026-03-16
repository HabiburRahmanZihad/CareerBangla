# CareerBangla Frontend Documentation

## Project Overview

**CareerBangla** is a Bangladesh-focused job portal platform connecting job seekers and recruiters.

The frontend is built with **Next.js** and **Tailwind CSS** and communicates with a REST API backend.

The goal is to provide a **responsive and modern UI** where:

- Users can search jobs
- Apply for jobs
- Manage their profiles and ATS resume
- Recruiters can post jobs and manage applicants

---

## Tech Stack

- **Framework:** Next.js  
- **Styling:** Tailwind CSS  
- **API Communication:** Axios / Fetch  
- **Authentication:** JWT  
- **Icons:** Lucide  
- **Deployment:** Vercel  

---

## Main User Roles

1. **User (Job Seeker)**
2. **Recruiter**
3. **Admin**

---

## Folder Structure Example

The project follows the **same folder structure used in the previous healthcare project**.

Since the architecture was already designed with **modularity and reusability in mind**, the same structure will be reused for this job portal project.

This approach ensures:

- Code consistency across projects  
- Faster development using reusable modules  
- Easier maintenance and scalability  

Therefore, developers should **follow the existing project structure from the previous project** when implementing this system.

> **Note:**  
> Instead of creating a completely new structure,  
> we will reuse the existing architecture and replace  
> the healthcare-specific modules with job portal modules.

---

## Main Pages

- Homepage  
- Login Page  
- Register Page  
- Job Listing Page  
- Job Details Page  
- User Dashboard  
- Recruiter Dashboard  
- Admin Dashboard  
- Profile Completion Page  
- Subscription Page  
- Coupon Redeem Page  

---

## User Features

- Signup and Login  
- Complete profile (ATS resume)  
- Search jobs with filters  
- Apply to jobs (costs coins)  
- View application status  
- Redeem gift voucher  
- Buy subscription coins  

---

## Recruiter Features

- Signup and login  
- Profile completion  
- Post job (cost coins)  
- View applicants  
- Download CV  
- Update application status  
- Search candidates manually  

---

## Admin Features

- Approve recruiters  
- Manage users  
- Manage jobs  
- Generate coupons  
- Generate gift vouchers  
- View platform analytics  

---

## UI Guidelines

- Fully responsive design  
- Use consistent color palette  
- Add loading states  
- Display error messages  
- Provide clear call-to-action buttons  

---

## Deployment

- Deploy frontend using **Vercel**
- Set environment variables for **API base URL**
- Ensure **production build works correctly before deployment**