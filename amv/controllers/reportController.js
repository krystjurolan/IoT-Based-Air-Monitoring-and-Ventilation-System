const db          = require('../models');
const { Op } = require("sequelize");
const moment = require('moment');

const { Rooms , Buildings, Data } = require('../models');

const fs = require('fs');
// const pdfmake = require('pdfmake');
const jsPDF = require('jspdf');
const html2canvas = require('html2canvas');
const ejs = require('ejs');
const path = require('path');

const generateReport = async (req, res, next) => {
    // const { device_id, date } = req.body;
      // console.log(device_id)

      const device_id = req.body.device_id;
      const date = req.body.date;
      const rooms = await Rooms.findAll({
        where:{
          device_id: device_id
        }
      });
      const buildings = await Buildings.findAll({
        where:{
          id: rooms[0].building_id
        }
      });
    
      try {
        const data = await Data.findAll({
          where: {
            device_id,
            createdAt: {
              [Op.gte]: moment.utc(date).startOf('day').toDate(),
              [Op.lt]: moment.utc(date).endOf('day').toDate(),
            },
          },
          group: [db.Sequelize.fn('hour', db.Sequelize.col('createdAt'))],
          attributes: [
            [db.Sequelize.fn('date_format', db.Sequelize.col('createdAt'), '%H:00:00'), 'hour'],
            [db.Sequelize.fn('avg', db.Sequelize.col('temperature')), 'avg_temperature'],
            [db.Sequelize.fn('avg', db.Sequelize.col('humidity')), 'avg_humidity'],
            [db.Sequelize.fn('avg', db.Sequelize.col('air_quality')), 'avg_air_quality'],
          ],
          raw: true,
        });

        // const filename = room[0].device_id + '_' + date + '_AMV-report'+'.pdf'
        // const template = fs.readFileSync(path.join(__dirname, '../views/template.ejs'), 'utf-8');

        // const docDefinition = {
        //     content: [
        //       { text: 'My Report', style: 'header' },
        //       { text: template, style: 'body' },
        //     ],
        //     styles: {
        //       header: { fontSize: 18, bold: true },
        //       body: { fontSize: 12, font: 'Roboto' },
        //     },
        //     defaultStyle: { font: 'Roboto' },
        //     pageMargins: [40, 60, 40, 60],
        // };

        // const pdfDoc = pdfmake.createPdf(docDefinition);

        // pdfDoc.pipe(fs.createWriteStream('path/to/output.pdf'));
        // pdfDoc.end();

        // const html = ejs.render(template, { rooms, buildings, data, date });

        // // Launch a headless Chrome instance using Puppeteer
        // const browser = await puppeteer.launch();
        // const page = await browser.newPage();

        // // Set the page content to the rendered HTML
        // await page.setContent(html);

        // // Generate a PDF of the page
        // const pdfBuffer = await page.pdf({
        //     format: 'A4',
        //     printBackground: true,
        //     margin: {
        //     top: '20px',
        //     bottom: '40px',
        //     left: '20px',
        //     right: '20px'
        //     }
        // });

        // // Save the PDF to a file
        // fs.writeFileSync(path.join(__dirname, '../views/template.ejs'), pdfBuffer);

        // // Close the browser
        // await browser.close();
    
        // res.json(data);

        // const templatePath = path.join(__dirname, '../views/template.ejs');
        // const templateData = {rooms, buildings, data, date};
        // const html = await ejs.render(templatePath, templateData);

        // // Use html2canvas to render the HTML as an image
        // html2canvas(html.querySelector('#template_invoice'))
        // .then((canvas) => {
        // // Add the image to a new jsPDF instance
        // const pdf = new jsPDF();
        // pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), 0);
        // // Download the PDF
        // res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
        // res.setHeader('Content-Type', 'application/pdf');
        // res.send(pdf.output('blob')); 
        // });

        res.render('template', {rooms, buildings, data, date});
      } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
      }
}

module.exports = { generateReport }