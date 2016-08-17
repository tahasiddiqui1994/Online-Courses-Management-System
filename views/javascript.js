			function checkName()
			{
				var name, regname;
			
				name=document.getElementById("name").value ;
				regname=/^[A-Za-z]/i ;
			
				if (regname.test(name)!=true)
				{
					document.getElementById("p0").style.color="red";
					document.getElementById("p0").innerHTML="Name (Invalid Name)";
				}
				else
				{
					document.getElementById("p0").style.color="white";
					document.getElementById("p0").innerHTML="Name";
				}
			}
			function checkID()
			{
				var dsuid, regdsuid;
			
				dsuid=document.getElementById("dsuid").value ;
				regdsuid=/^[A-Za-z]+[0-9]/i ;
			
				if (regdsuid.test(dsuid)!=true)
				{
					document.getElementById("p1").style.color="red";
					document.getElementById("p1").innerHTML="DSUID (Invalid ID)";
				}
				else
				{
					document.getElementById("p1").style.color="white";
					document.getElementById("p1").innerHTML="DSUID";
				}
			}
			function checkEmail()
			{
				var email, regemail;
				email = document.getElementById("mail").value;
				regemail=/^[a-z0-9.?_?]+@[a-z]+.[a-z]{2,5}$/i ;
			
				if(regemail.test(email)!=true)
				{
					document.getElementById("p2").style.color="red";
					document.getElementById("p2").innerHTML="Email (Invalid Email)";
				}
				else
				{
					document.getElementById("p2").style.color="white";
					document.getElementById("p2").innerHTML="Email";
				}
			}
			function checkPassword1()
			{
				var pass, regpass;
				pass = document.getElementById("password1").value;
				//pass = document.forms["myForm"]["password1"].value;
			
				if(pass == null || pass == "")
				{
					document.getElementById("p3").style.color="red";
					document.getElementById("p3").innerHTML="Password (Invalid Password)";
				}
				else
				{
					document.getElementById("p3").style.color="white";
					document.getElementById("p3").innerHTML="Password";
				}
			}
			/*function myFunction()
            {
                var name = document.getElementById("p0").style.color;
                var dsuid = document.getElementById("p1").style.color;
                var email = document.getElementById("p2").style.color;
                var password = document.getElementById("p3").style.color;
            
                if (name == "red" || dsuid == "red" || email == "red" || password == "red")
                {
                	alert("Please fill all the inputs fields ...");
                }
            }*/
