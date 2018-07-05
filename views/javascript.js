			function checkFName()
			{
				var fname, regfname;

				fname=document.getElementById("firstname").value ;
				regfname=/^[A-Za-z_?-?]/;

				if (regfname.test(fname)!=true)
				{
					document.getElementById("p01").style.color="red";
					document.getElementById("p01").innerHTML="First Name";
				}
				else
				{
					document.getElementById("p01").style.color="black";
					document.getElementById("p01").innerHTML="First Name";
				}
			}
			function checkLName()
			{
				var lname, reglname;

				lname=document.getElementById("lastname").value ;
				reglname=/^[A-Za-z_?-?]/;

				if (reglname.test(lname)!=true)
				{
					document.getElementById("p02").style.color="red";
					document.getElementById("p02").innerHTML="Last Name";
				}
				else
				{
					document.getElementById("p02").style.color="black";
					document.getElementById("p02").innerHTML="Last Name";
				}
			}
			function checkID()
			{
				var dsuid, regdsuid;

				dsuid=document.getElementById("DSUID").value ;
				regdsuid= /[a-zA-Z]{2}\d{6}/ ;//[a-zA-Z]{2}\d{6}

				if (regdsuid.test(dsuid)!=true)
				{
					document.getElementById("p1").style.color="red";
					document.getElementById("p1").innerHTML="DSU ID";
				}
				else
				{
					document.getElementById("p1").style.color="black";
					document.getElementById("p1").innerHTML="DSU ID";
				}
			}
			function checkEmail()
			{
				var email, regemail;
				email = document.getElementById("mail").value;
//				regemail=/^[a-z0-9.?_?]+@[a-z.?]+.[a-z]{2,5}/ ;
				regemail=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

				if(regemail.test(email)!=true)
				{
					document.getElementById("p2").style.color="red";
					document.getElementById("p2").innerHTML="Email";
				}
				else
				{
					document.getElementById("p2").style.color="black";
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
					document.getElementById("p3").innerHTML="Password";
				}
				else
				{
					document.getElementById("p3").style.color="black";
					document.getElementById("p3").innerHTML="Password";
				}
			}
			function checkCNIC()
			{
				var cnic, regcnic;

				cnic = document.getElementById("cnic").value;
				regcnic = /\d{5}-\d{7}-\d{1}/;

				if(regcinc.test(cnic)!=true)
				{
					document.getElementById("p4").style.color="red";
					document.getElementById("p4").innerHTML="CNIC";
				}
				else
				{
					document.getElementById("p4").style.color="black";
					document.getElementById("p4").innerHTML="CNIC";
				}
			}
			function checkCellNo()
			{
				var cellNumber, regCell;

				cellNumber = document.getElementById("mobile").value;
				regCell = /^[0-9]{11}/ ;

				if(regCell.test(cellNumber)!=true)
				{
					document.getElementById("p5").style.color="red";
					document.getElementById("p5").innerHTML="Cell Number";
				}
				else
				{
					document.getElementById("p5").style.color="black";
					document.getElementById("p5").innerHTML="Cell Number";
				}
			}
			function checkAge()
			{
				var age, regAge;

				age = document.getElementById("age").value;
				regAge = /^[0-9]{2}/ ;

				if(regAge.test(age)!=true)
				{
					document.getElementById("p6").style.color="red";
					document.getElementById("p6").innerHTML="Age";
				}
				else
				{
					document.getElementById("p6").style.color="black";
					document.getElementById("p6").innerHTML="Age";
				}
			}

			function checkGender()
			{
				var gender, reggender;

				gender = document.getElementById("gender").value;
				reggender = /^[mfMF]{1}/ ;

				if(reggender.test(gender)!=true)
				{
					document.getElementById("p8").style.color="red";
					document.getElementById("p8").innerHTML="GENDER";
				}
				else
				{
					document.getElementById("p8").style.color="black";
					document.getElementById("p8").innerHTML="GENDER";
				}
			}

			function checkSemester()
			{
				var Semester, regSemester;

				Semester = document.getElementById("semester").value;
				regSemester = /^[1-8]{1}/ ;

				if(regSemester.test(Semester)!=true)
				{
					document.getElementById("p7").style.color="red";
					document.getElementById("p7").innerHTML="SEMESTER";
				}
				else
				{
					document.getElementById("p7").style.color="black";
					document.getElementById("p7").innerHTML="SEMESTER";
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
