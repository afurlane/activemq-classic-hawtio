module.exports = {
  url: "http://localhost:8080",
  output: "greenframe-report.json",
  scenarios: [
    {
      label: "Hawtio Plugin Load",
      url: "http://localhost:8080/activemq-classic"
    }
  ]
};
