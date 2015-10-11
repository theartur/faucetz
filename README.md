# faucetz
Nobody can stop an idea whose time has come

// soon to be cloud stored and total satoshi ranked ;}-

 * PIJAMONEY * 

TO DO:

- "Destroy Broken Faucet" button
- Add Faucet button
- fix image repetition problem
- Verify flow of construction to avoid changing numbers
- secure list of faucets


// REFLUX TO AUTOMATE EVERYTHING

- Fetch FaucetBox list


- cloud store info
- total satoshi paid rank
- explore 2 modes:
 - top bar toggle between modes
 - private mode
 - shared mode
- live interactions for shared mode
 - numbers update
 - glow card when someone report pay


Existe apenas uma lista, 
que guarda o estado geral 
com disponibilidade de 
5 ultimos pagamentos registrados, 
e 5 ultimos comentarios

O agente de merge deve percorrer por toda lista local 
e comparar com a lista remota

Quem tem o maior numero de comentarios e pagamentos ganha
O criterio de desempate é o valor total pago

Você vai guardar por index: url, assim facilita operações unitárias

Então, no saveEverything, você vai pedir também a url para salvar


Então a sequência será:
 - você vai salvar o item com todas suas propriedades sob o index como URL
 ex: Faucetz.cloudLog.child("faucetz-index").child(url).child("payments").push(value)
 ex: Faucetz.cloudLog.child("faucetz-index").child(url).child("comments").push(value)
 ex: Faucetz.cloudLog.child("faucetz-index").child(url).child("visits").push(value)