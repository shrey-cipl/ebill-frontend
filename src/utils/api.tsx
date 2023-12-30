export async function getAllOfficers() {
    const response = await fetch('http://localhost:8080/api/officers/getAll');
    const data = await response.json();
    return data;
  };
  export async function getDailyPass() {
    const response = await fetch('http://localhost:8080/api/gatePass/visitors/getall?type=daily');
    const data = await response.json();
    // console.log(data)
    return data;
  };
  
  export async function createOfficer(officerData:any) {
    const response = await fetch('http://localhost:8080/api/officers/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(officerData),
    });
  
    if (!response.ok) {
      throw new Error('Failed to create officer');
    }
  };