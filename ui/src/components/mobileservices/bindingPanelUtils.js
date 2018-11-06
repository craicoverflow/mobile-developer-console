
import React from 'react';


//This renders the json fields using the rules from the form definition.
export const  OpenShiftObjectTemplate = function({ TitleField, uiSchema, properties, title, description }) {
    const form = uiSchema.form
  
    return (
      <div>
      <TitleField title={title} />
      <div className="row">
        {form.map(key => (
          getOpenShiftField(key, properties)
        ))}
      </div>
      {description}
    </div>
    );
  }
  
  function getOpenShiftField(field, properties) {
    if (!field.items) {
      const property = properties.find(prop=>prop.name === field)
      return <div
                key={property.content.key}>
                {property.content}
              </div>
    } else {
      return getFieldSet(field, properties);
    }
  }
  
  function getFieldSet(field, properties) {
    const title = field.title;
    const items = field.items;
  
    const fieldSetItems = items.map(item => {
      if (typeof item === "string") {
        return properties.find(prop=>prop.name === item).content
      } else {
        return properties.find(prop=>prop.name === item.key).content
      }
    })
  
    return <fieldset>
      <h2>{title}</h2>
    {
      fieldSetItems
    }</fieldset>;
  }
