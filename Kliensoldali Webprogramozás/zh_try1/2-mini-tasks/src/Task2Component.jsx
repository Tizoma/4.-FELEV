import { useEffect, useState } from 'react';
import ContactList from './ContactList.jsx';
import EditContact from './EditContact.jsx';

export default function Task2Component() {
  const [ contacts, setContacts] = useState(initialContacts);
  const [selectedId,setSelectedId] = useState(0);
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  // const selectedContact = contacts.find(c =>
  //   c.id === selectedId
  // );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }
  useEffect(() => {
    setSelectedContact(contacts[selectedId]);
    console.log(selectedContact);
  }, [selectedId]);

  function handleChange(id){
    setSelectedId(id);
    setSelectedContact(contacts[id]);
    console.log(contacts[id]);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <hr />
      <EditContact
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Máté', email: 'matthew@mail.com' },
  { id: 1, name: 'Márk', email: 'mark@mail.com' },
  { id: 2, name: 'Éva', email: 'eve@mail.com' }
];
