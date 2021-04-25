
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

@WebServlet("/NewAccountServlet")
public class NewAccountServlet extends HttpServlet{
    private static final long serialVersionUID = 1L;
    
    
	  @Override
	  protected void doOptions(HttpServletRequest req, HttpServletResponse resp)
	          throws ServletException, IOException {
	      setAccessControlHeaders(resp);
	      resp.setStatus(HttpServletResponse.SC_OK);
	  }

	  private void setAccessControlHeaders(HttpServletResponse resp) {
	      resp.setHeader("Access-Control-Allow-Origin", "*");
	      resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	      resp.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  }
	  
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);
        
        
        PrintWriter pw = response.getWriter();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        
        String payloadRequest = BodyReader.getBody(request);
        
        Type type = new TypeToken<HashMap<String, String>>(){}.getType();
        HashMap<String, String> body = new Gson().fromJson(payloadRequest, type);
        
       
        String registrationType = body.get("type");

        String email = body.get("email");
        String name = body.get("name");
        
        if(email == null || name == null || email.equals("") || email.equals("")) {
            response.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
            String error = "Missing name or email field.";
            pw.write(new Gson().toJson(error));
            pw.flush();
            return;
        }
        
        if(registrationType == null) {
        	response.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
            String error = "type is null.";
            pw.write(new Gson().toJson(error));
            pw.flush();
            return;
        }


        if(registrationType.equals("normal")) {
            String username = body.get("username");
            String password = body.get("password");

            if(username == null || password == null || username.isBlank() || password.isBlank()) {
                response.setStatus(HttpServletResponse.SC_PAYMENT_REQUIRED);
                String error = "Missing username or password field.";
                pw.write(new Gson().toJson(error));
                pw.flush();
            }
            else {
                Integer id = JDBCConnector.normalRegister(email, name, username, password);
                if(id == -1) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    String error = "Username already exists.";
                    pw.write(new Gson().toJson(error));
                    pw.flush();
                }
                else {
                    response.setStatus(HttpServletResponse.SC_OK);
                    pw.write(new Gson().toJson(id));
                    pw.flush();
                }
            }

        }
        else if (registrationType.equals("other")) {
            Integer id = JDBCConnector.facebookLogin(email, name);
            if(id == -1) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                String error = "Username already exists.";
                pw.write(new Gson().toJson(error));
                pw.flush();
            }
            else {
                response.setStatus(HttpServletResponse.SC_OK);
                pw.write(new Gson().toJson(id));
                pw.flush();
            }
        }
        else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Invalid registration type specified.";
            pw.write(new Gson().toJson(error));
            pw.flush();
        }
    }

}