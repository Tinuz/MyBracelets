async function testCharmsAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/charms');
    const charms = await response.json();
    
    console.log('Total charms:', charms.length);
    console.log('\nCharms with images:');
    
    charms.forEach(charm => {
      if (charm.imageUrl) {
        console.log(`- ${charm.name} (${charm.sku}): ${charm.imageUrl}`);
      }
    });
    
    console.log('\nFirst 3 charms:');
    charms.slice(0, 3).forEach(charm => {
      console.log(`${charm.name}: imageUrl=${charm.imageUrl || 'null'}, hasSvg=${!!charm.svg}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testCharmsAPI();