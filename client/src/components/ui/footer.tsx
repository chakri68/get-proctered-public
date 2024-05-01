import React from "react";

const Footer = () => {
  return (
    <div className="fixed bottom-0 w-full">
      <footer className="footer p-10 bg-neutral text-neutral-content">
        <nav className="ml-56 text-md">
          <a href="https://iiitl.ac.in/" className="link link-hover">IIIT Lucknow</a>
          <div>Chak Ganjaria, C. G. City</div>
          <div>Lucknow – 226002</div>
          <a href="mailto:contact@iiitl.ac.in" className="link link-hover underline">contact@iiitl.ac.in</a>
        </nav>
        <nav>
          <h6 className="footer-title">Services</h6>
          <a href="" className="link link-hover">AI Proctoring</a>
          <a href="" className="link link-hover">Professor Dashboard</a>
          <a href="" className="link link-hover">Quizes for students</a>
        </nav>
        <nav>
          <h6 className="footer-title">Contributors</h6>
          <a href="https://www.linkedin.com/in/sahil-singh-2a330927b/" className="link link-hover">Sahil Singh</a>
          <a href="https://linkedin.com/in/chakradhar-reddy-d" className="link link-hover">Chakradhar Reddy</a>
          <a href="https://www.linkedin.com/in/savarna-chandra/" className="link link-hover">Savarna Chandra</a>
          <a href="https://www.linkedin.com/in/aryaman-shukla-575330244/" className="link link-hover">Aryaman Shukla</a>
          <a href="https://www.linkedin.com/in/annu-priya-411064228/" className="link link-hover">Annu Priya Kumari</a>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;
