import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import driver.*;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet{
    private static final long serialVersionUID = 1L;
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        PrintWriter pw = response.getWriter();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String loginType = request.getParameter("type");


        if(loginType.equals("normal")) {
            String username = request.getParameter("username");
            String password = request.getParameter("password");

            if(username == null || password == null || username.isBlank() || password.isBlank()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                String error = "Missing username or password field.";
                pw.write(new Gson().toJson(error));
                pw.flush();
            }
            Integer id = JDBCConnector.normalLogin(username, password);
            if(id == -1) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                String error = "Failed to log in user.";
                pw.write(new Gson().toJson(error));
                pw.flush();
            }
            else {
                response.setStatus(HttpServletResponse.SC_OK);
                pw.write(new Gson().toJson(id));
                pw.flush();
            }

        }
        else if(loginType.equals("other")) {
            String email = request.getParameter("email");
            String name = request.getParameter("name");

            if(email == null || name == null || email.isBlank() || name.isBlank()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                String error = "Missing name or email field.";
                pw.write(new Gson().toJson(error));
                pw.flush();
            }
            Integer id = JDBCConnector.facebookLogin(email, name);
            response.setStatus(HttpServletResponse.SC_OK);
            pw.write(new Gson().toJson(id));
            pw.flush();

        }
        else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Invalid login type specified.";
            pw.write(new Gson().toJson(error));
            pw.flush();
        }




    }

}
