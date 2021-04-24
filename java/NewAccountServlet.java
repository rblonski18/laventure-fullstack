import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import driver.JDBCConnector;

@WebServlet("/NewAccountServlet")
public class NewAccountServlet extends HttpServlet{
    private static final long serialVersionUID = 1L;
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        PrintWriter pw = response.getWriter();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String registrationType = request.getParameter("type");

        String email = request.getParameter("email");
        String name = request.getParameter("name");

        if(email == null || name == null || email.isBlank() || name.isBlank()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Missing name or email field.";
            pw.write(new Gson().toJson(error));
            pw.flush();
        }


        if(registrationType.equals("normal")) {
            String username = request.getParameter("username");
            String password = request.getParameter("password");

            if(username == null || password == null || username.isBlank() || password.isBlank()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
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