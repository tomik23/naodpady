// keeping the results always on top
const ScrollTopWindow = () => {
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
};

export default ScrollTopWindow;
