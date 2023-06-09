import React from 'react'

const App = () => {

  const buyerEmail = "enter_buyers_email"


    function isDate(val) {
        return Object.prototype.toString.call(val) === '[object Date]'
      }
      
      function isObj(val) {
        return typeof val === 'object'
      }
      
       function stringifyValue(val) {
        if (isObj(val) && !isDate(val)) {
          return JSON.stringify(val)
        } else {
          return val
        }
      }
      
      function buildForm({ action, params }) {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)
      
        Object.keys(params).forEach(key => {
          const input = document.createElement('input')
          input.setAttribute('type', 'hidden')
          input.setAttribute('name', key)
          input.setAttribute('value', stringifyValue(params[key]))
          form.appendChild(input)
        })
      
        return form
      }
      
       function post(details) {
        const form = buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
      }



    const getData=(data)=>
    {
        return fetch(`http://localhost:60/api/payment`,{
            method:"POST",
            headers:{
                Accept:"application/json",
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        }).then(response=>response.json()).catch(err=>console.log(err))
        
    }
    const makePayment=()=>{
        getData({amount:500,email: buyerEmail}).then(response=>{
            var information={
                action:"https://securegw-stage.paytm.in/order/process",
                params:response
            }
            post(information)
        })
        
    }
  return (
    <div>
      <button onClick={makePayment}>Pay using Paytm</button>
    </div>
  )
}

export default App