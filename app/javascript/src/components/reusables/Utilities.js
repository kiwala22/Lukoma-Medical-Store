export default {
  isMobile() {
    return (
      /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ||
      /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.platform)
    );
  },
};
