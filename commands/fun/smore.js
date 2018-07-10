const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');

module.exports = class SmoreCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'smore',
      aliases: [],
      group: 'fun',
      memberName: 'smore',
      description: 'Displays a random picture of S\'mores Pop-Tarts.',
      details: oneLine`Our bot is based on S'mores Pop-Tarts.
        We figured we could honor that with a command to display
        a random picture of our namesake.`
    });
  }

  run(message) {
    const toSmore = [
      'https://www.poptarts.com/content/NorthAmerica/pop_tarts/en_US/pages/flavors/bakery/frosted-s-mores-toaster-pastries/jcr:content/productContent/par/responsiveimage.img.png/1475703429032.png',
      'https://i.ytimg.com/vi/aH8Xhz8a6VA/maxresdefault.jpg',
      'https://i5.walmartimages.com/asr/a666e566-cb3c-49e3-b53e-ec969e4c85c4_1.3194f476fa1cb6a1751cb559c2a67b58.jpeg',
      'https://upload.wikimedia.org/wikipedia/commons/b/be/Pop-Tarts-Smores.jpg',
      'https://static1.squarespace.com/static/553b26fde4b08ceb08a4242c/553b2823e4b0eb3719c6d635/553b2840e4b0eb3719c7e599/1312325953023/1000w/6002537933_e8d711701d.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/6a/24/32/6a2432d9f8b0d57243daa7fe0c67745f.jpg',
      'https://static1.squarespace.com/static/553b26fde4b08ceb08a4242c/553b2823e4b0eb3719c6d635/553b2840e4b0eb3719c7e597/1312325932973/1000w/6003055289_9c6c378d29.jpg',
      'http://www.everyview.com/wp-content/uploads/2009/09/smorespoptar.jpg',
      'http://www.thegrocerygirls.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/N/Y/NYFMK.jpg.jpg',
      'http://www.theimpulsivebuy.com/images/smorespoptarts.jpg',
      'https://s-media-cache-ak0.pinimg.com/736x/12/4a/da/124ada781e33ae30fed95b616c19c0f1.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUazFmo_xjAOxt44oDs4uypI7cu0ZFJprbOXo-5kLuvZa6V2wW',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4PndtuGusz7YTaHQ6L7iB3Oxt0L4Qsu6_88GLkPjSWpwU_kfU',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZvH2ZQhcIFPyNIZlU1pVhfxk82g0T-ttaIIY9F3x0k5KgO3vn',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxf-9Siyd9MYyvPLCeyZPHJE4yODJJSFy9nje5K5EhAxtsrUy6fg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG7_P7wGeFYGeeQUp0F_p_jxTjX58nfyQXTRmec7m3sB0MGcRf',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm2botsr9ClVPFi3UGOEJIhzWEr7zRFu0et9qw1ptoDg8_w77AMQ',
      'http://www.taquitos.net/im/sn/PopTarts-Smores.jpg',
      'https://i5.walmartimages.ca/images/Large/140/637/140637.jpg',
      'https://thejelliedbelly.files.wordpress.com/2013/12/pop-t.jpg',
      'https://runningtofit.files.wordpress.com/2010/07/img_3456.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzMukpkvYLL_AVtL1JV11mOXcuoecML2K1t1ohfhtRLH-8hNSmhQ',
      'http://theswca.com/images-food/poptarts-smores.jpg'
    ];
    message.channel.send(toSmore[Math.floor(Math.random() * toSmore.length)]);
  }
};
